// --- Firebase Backup System with Local Download/Upload Extension ---

import { db } from "../firebase.js";
import {
  doc,
  setDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// --- Config ---
const FIREBASE_BACKUP_KEY = "firebaseBackupTime";
const HABIT_DATA_KEY = "habitData"; // Legacy key for old habit data
const LEGACY_KEY = "habitData";
const COMMIT_KEYS = ["commitmentRegistry", "commitmentLog"];
const HABIT_USER_ID_KEY = "habitUserId";
const BACKUP_INTERVAL = 1000 * 60 * 60 * 24 * 3; // 3 days

// --- Utility ---
function getUserId() {
  let id = localStorage.getItem(HABIT_USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(HABIT_USER_ID_KEY, id);
  }
  return id;
}

function getReadableDocId(userId) {
  const now = new Date();
  const ddmmyy = now.toLocaleDateString("en-GB").replaceAll("/", "-");
  return `${ddmmyy}_${userId.slice(0, 6)}`;
}

// --- Core Backup ---
async function uploadBackup(data) {
  const userId = getUserId();
  const docId = getReadableDocId(userId);
  const userCollection = collection(db, "backups", userId, "entries");

  await setDoc(doc(userCollection, docId), {
    data,
    timestamp: new Date().toISOString(),
  });

  localStorage.setItem(FIREBASE_BACKUP_KEY, Date.now());
  console.log(`✅ Firebase backup complete: ${docId}`);
}

export async function backupToFirebase() {
  const last = parseInt(localStorage.getItem(FIREBASE_BACKUP_KEY) || 0);
  if (Date.now() - last < BACKUP_INTERVAL) {
    console.log("⏸️ Skipping Firebase backup: too soon.");
    return;
  }

  await forceFirebaseBackup();
}

export async function forceFirebaseBackup() {
  const raw = localStorage.getItem(HABIT_DATA_KEY);
  if (!raw) {
    console.warn("⚠️ No habitData found for backup.");
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    await uploadBackup(parsed);
  } catch (e) {
    console.error("❌ Backup failed:", e);
  }
}

export function downloadHabitData() {
  const payload = {};

  let found = false;
  for (const key of COMMIT_KEYS) {
    const data = localStorage.getItem(key);
    if (data) {
      payload[key] = JSON.parse(data);
      found = true;
    }
  }

  if (!found) return alert("No commitment data found in localStorage.");

  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `commitment-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function uploadHabitDataFile(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const parsed = JSON.parse(event.target.result);

      // Legacy format detection: YYYY-MM-DD keys with sobriety or slots inside
      const isLegacy =
        typeof parsed === "object" &&
        Object.keys(parsed).every((k) => /^\d{4}-\d{2}-\d{2}$/.test(k)) &&
        typeof parsed[Object.keys(parsed)[0]] === "object";

      if (isLegacy) {
        localStorage.setItem("habitData", JSON.stringify(parsed));
        console.log("🕰️ Legacy data uploaded. Initiating migration...");
        migrateHabitsToCommitments(); // auto-run migration
        alert("✅ Legacy data uploaded and migrated.");
        return;
      }

      // New commitment-based format
      const keys = ["commitmentRegistry", "commitmentLog"];
      let restored = false;
      for (const key of keys) {
        if (parsed[key]) {
          localStorage.setItem(key, JSON.stringify(parsed[key]));
          restored = true;
        }
      }

      if (restored) {
        alert("✅ Commitment data restored.");
      } else {
        alert("❌ Unrecognized file format.");
      }
    } catch (e) {
      alert("❌ Invalid file.");
      console.error(e);
    }
  };

  reader.readAsText(file);
}
