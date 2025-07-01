import { createCommitment, isValidCommitment } from "./registry.js";
import { scoreCalculation } from "../core/scoring.js";
import { toLocalDateString } from "../utils.js";
import { STORAGE_KEYS } from "./storageKeys.js";

const { CURRENT_COMMITMENT, COMMITMENT_REGISTRY, COMMITMENT_LOG } =
  STORAGE_KEYS;

function normalizeDate(date) {
  return toLocalDateString(date);
}

export default class CommitmentStore {
  constructor() {
    this.registry = this._load("commitmentRegistry") || {};
    this.log = this._load("commitmentLog") || {};
    this.activeCommitmentId =
      localStorage.getItem("currentCommitment") ||
      Object.keys(this.registry)[0] ||
      null;
  }
  getStartDate(commitmentId) {
    const history = this.getHistory(commitmentId);
    return history.length ? history[0].date : null;
  }

  setActiveCommitment(id) {
    if (this.registry[id]) {
      this.activeCommitmentId = id;
      localStorage.setItem("currentCommitment", id);
    }
  }

  addCommitment(name, config = {}) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const id = `commitment_${slug}_${Date.now()}`;
    const entry = createCommitment({ name, config });
    if (!isValidCommitment(entry)) throw new Error("Invalid commitment config");
    this.registry[id] = entry;
    this._save("commitmentRegistry", this.registry);
    return id;
  }

  removeCommitment(id) {
    delete this.registry[id];
    for (const date in this.log) {
      if (this.log[date][id]) {
        delete this.log[date][id];
        if (Object.keys(this.log[date]).length === 0) {
          delete this.log[date];
        }
      }
    }
    this._save("commitmentRegistry", this.registry);
    this._save("commitmentLog", this.log);
  }

  toggleSlot(commitmentId, date, slot) {
    if (slot == null) return;
    const normDate = normalizeDate(date);
    if (!this.log[normDate]) this.log[normDate] = {};

    const current = this.log[normDate][commitmentId];
    const slotSet = new Set(current?.slots || []);
    const beforeSize = slotSet.size;

    slotSet.has(slot) ? slotSet.delete(slot) : slotSet.add(slot);
    const afterSize = slotSet.size;

    this.log[normDate][commitmentId] = {
      slots: [...slotSet],
      timestamp:
        afterSize !== beforeSize
          ? Date.now()
          : current?.timestamp || Date.now(),
    };

    this._save("commitmentLog", this.log);
  }

  getSlots(commitmentId, date) {
    const normDate = normalizeDate(date);
    return this.log[normDate]?.[commitmentId]?.slots || [];
  }

  getHistory(commitmentId) {
    return Object.entries(this.log)
      .filter(([_, entries]) => entries[commitmentId])
      .map(([date, entries]) => ({
        date,
        slots: entries[commitmentId].slots,
        timestamp: entries[commitmentId].timestamp,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  getScore(commitmentId) {
    const days = this.getHistory(commitmentId).map((entry) => entry.date);
    return days.length ? scoreCalculation(days) : 0;
  }

  _save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to save ${key}:`, e);
    }
  }

  _load(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Failed to load ${key}:`, e);
      return null;
    }
  }
}
