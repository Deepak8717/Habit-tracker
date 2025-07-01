// --- Firebase Backup System with Local Download/Upload Extension ---

import { db } from "../firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// --- Config ---
const FIREBASE_BACKUP_KEY = "firebaseBackupTime";
const COMMIT_KEYS = ["commitmentRegistry", "commitmentLog"];
const HABIT_USER_ID_KEY = "habitUserId";

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

function getBackupDocRef(userId, docId) {
  return doc(collection(db, "backups", userId, "entries"), docId);
}

// --- Core Backup ---
async function uploadBackup(data) {
  const userId = getUserId();
  const docId = getReadableDocId(userId);
  const docRef = getBackupDocRef(userId, docId);

  await setDoc(docRef, {
    data,
    timestamp: new Date().toISOString(),
  });

  await pruneOldBackups(userId);
  localStorage.setItem(FIREBASE_BACKUP_KEY, Date.now());
  console.log(`✅ Firebase backup complete: ${docId}`);
}

export async function backupToFirebase() {
  const origin = location.href;
  const LIVE_URL_PREFIX = "https://deepak8717.github.io/Habit-tracker/";
  if (!origin.startsWith(LIVE_URL_PREFIX)) {
    console.log("🚫 Not on the live site. Skipping backup.");
    return;
  }

  const today = new Date().getDay(); // Sunday = 0, Wednesday = 3
  if (![0, 3].includes(today)) {
    console.log("📅 Not a backup day (only Sunday/Wednesday). Skipping.");
    return;
  }

  await forceFirebaseBackup();
}

export async function forceFirebaseBackup() {
  const payload = {};

  let found = false;
  for (const key of COMMIT_KEYS) {
    const data = localStorage.getItem(key);
    if (data) {
      payload[key] = JSON.parse(data);
      found = true;
    }
  }

  if (!found) {
    console.warn("⚠️ No commitment data found for backup.");
    return;
  }

  try {
    await uploadBackup(payload);
  } catch (e) {
    console.error("❌ Backup failed:", e);
  }
}

async function pruneOldBackups(userId) {
  const userCollection = collection(db, "backups", userId, "entries");
  const snapshot = await getDocs(userCollection);

  const now = Date.now();
  const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

  const deletions = snapshot.docs.filter((doc) => {
    const ts = new Date(doc.data()?.timestamp || 0).getTime();
    return now - ts > SEVEN_DAYS;
  });

  for (const docSnap of deletions) {
    await deleteDoc(doc(userCollection, docSnap.id));
    console.log(`🗑️ Deleted backup: ${docSnap.id}`);
  }
}

// --- Manual Tools ---

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
      let restored = false;
      for (const key of COMMIT_KEYS) {
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
