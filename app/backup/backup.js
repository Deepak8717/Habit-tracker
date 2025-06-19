// --- Firebase Backup System with Local Download/Upload Extension ---

import { db } from "../firebase.js";
import {
  doc,
  setDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// --- Config ---
const FIREBASE_BACKUP_KEY = "firebaseBackupTime";
const HABIT_DATA_KEY = "habitData";
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

// --- Local Backup Tools ---
export function downloadHabitData() {
  const data = localStorage.getItem(HABIT_DATA_KEY);
  if (!data) return alert("No habit data found in localStorage.");

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `habitData-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
      localStorage.setItem(HABIT_DATA_KEY, JSON.stringify(parsed));
      alert("✅ Habit data restored. Refresh to apply changes.");
    } catch (e) {
      alert("❌ Invalid habit data file.");
    }
  };
  reader.readAsText(file);
}
