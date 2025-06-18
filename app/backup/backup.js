import { db } from "../firebase.js";
import {
  doc,
  setDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

function getUserId() {
  let id = localStorage.getItem("habitUserId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("habitUserId", id);
  }
  return id;
}

function getReadableDocId(userId) {
  const now = new Date();
  const ddmmyy = now.toLocaleDateString("en-GB").replaceAll("/", "-");
  return `${ddmmyy}_${userId.slice(0, 6)}`;
}

export async function backupToFirebase() {
  const last = parseInt(localStorage.getItem("firebaseBackupTime") || 0);
  const THREE_DAYS = 1000 * 60 * 60 * 24 * 3;

  if (Date.now() - last < THREE_DAYS) {
    console.log("Skipping Firebase backup: last backup was recent.");
    return;
  }
  const raw = localStorage.getItem("habitData");
  if (!raw) {
    console.warn("No habitData found in localStorage.");
    return;
  }

  const data = JSON.parse(raw);
  const timestamp = new Date().toISOString();
  const userId = getUserId();
  const docId = getReadableDocId(userId);

  try {
    const userCollection = collection(db, "backups", userId, "entries");
    await setDoc(doc(userCollection, docId), {
      data,
      timestamp,
    });
    console.log(`Backup successful: ${docId}`);
  } catch (err) {
    console.error("Backup failed:", err);
  }
}
