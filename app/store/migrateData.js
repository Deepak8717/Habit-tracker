export function migrateHabitsToCommitments() {
  const raw = localStorage.getItem("habitData");
  if (!raw) return console.warn("❌ No habitData found.");

  let habitData;
  try {
    habitData = JSON.parse(raw);
  } catch (e) {
    console.error("❌ Failed to parse habitData:", e);
    return;
  }

  // Backup first
  localStorage.setItem("habitData_backup", raw);

  // Prompt for commitment name
  const name = prompt(
    "What are you commited to (e.g. Sobriety, Yoga, Study):"
  )?.trim();
  if (!name) {
    console.warn("❌ Migration aborted: no name entered.");
    return;
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const timestamp = Date.now();
  const commitmentId = `commitment_${slug}_${timestamp}`;

  const commitmentRegistry = {
    [commitmentId]: {
      name,
      createdAt: timestamp,
      config: {
        mode: "full-day",
        frequency: "daily",
        color: "#3498db",
      },
    },
  };

  const commitmentLog = {};

  for (const date in habitData) {
    const entry = habitData[date];
    const source = entry?.slots
      ? entry
      : entry?.sobriety && Array.isArray(entry.sobriety.slots)
      ? entry.sobriety
      : null;

    if (!source) continue;

    commitmentLog[date] = {
      [commitmentId]: {
        slots: source.slots,
        timestamp: source.timestamp || timestamp,
      },
    };
  }

  localStorage.setItem(
    "commitmentRegistry",
    JSON.stringify(commitmentRegistry)
  );
  localStorage.setItem("commitmentLog", JSON.stringify(commitmentLog));
  localStorage.removeItem("habitData");

  console.log(`✅ Migrated as: "${name}" → ${commitmentId}`);
}
