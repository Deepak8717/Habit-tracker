/**
 * Commitment Registry
 * ------------------
 * This object is dynamically populated at runtime.
 * Each commitment can have its own config (e.g. scoring, frequency, color).
 */

export const commitmentRegistry = {};

export const VALID_MODES = ["full-day", "hourly"];
export const VALID_FREQUENCIES = ["daily", "weekly", "custom"];

/**
 * Generate a unique commitment ID from a name
 * @param {string} name
 * @returns {string}
 */
export function generateCommitmentId(name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `commitment_${slug}_${Date.now()}`;
}

/**
 * Create a new commitment object.
 * @param {string} name - Display name of the commitment.
 * @param {object} config - { mode, color, frequency }
 * @returns {object}
 */
export function createCommitment({ name, config = {} }) {
  return {
    name,
    config: {
      mode: VALID_MODES.includes(config.mode) ? config.mode : "full-day",
      color: typeof config.color === "string" ? config.color : "#3498db",
      frequency: VALID_FREQUENCIES.includes(config.frequency)
        ? config.frequency
        : "daily",
    },
    createdAt: Date.now(),
  };
}

/**
 * Normalize a commitment object safely.
 * @param {object} entry
 * @returns {object}
 */
export function normalizeCommitment(entry) {
  return createCommitment({
    name: entry?.name || "Unnamed",
    config: entry?.config || {},
  });
}

/**
 * Validate commitment object shape.
 * @param {object} entry
 * @returns {boolean}
 */
export function isValidCommitment(entry) {
  return (
    typeof entry?.name === "string" &&
    typeof entry?.createdAt === "number" &&
    entry?.config &&
    VALID_MODES.includes(entry.config.mode) &&
    VALID_FREQUENCIES.includes(entry.config.frequency) &&
    typeof entry.config.color === "string"
  );
}
