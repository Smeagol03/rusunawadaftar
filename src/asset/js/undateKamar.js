import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDdd1vFusi_RKEazwc2Pc7wP39HUD6WM5E",
  authDomain: "daftar-rusunawa.firebaseapp.com",
  databaseURL:
    "https://daftar-rusunawa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "daftar-rusunawa",
  storageBucket: "daftar-rusunawa.firebasestorage.app",
  messagingSenderId: "529594513792",
  appId: "1:529594513792:web:8f4db9655d2cb6ca4e2965",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function updateStatusKamar() {
  const penghuniSnapshot = await get(ref(db, "penghuni"));
  const kamarUpdate = {};

  if (penghuniSnapshot.exists()) {
    const data = penghuniSnapshot.val();

    Object.values(data).forEach((item) => {
      const noKamar = item.nomor_kamar;
      if (noKamar) {
        kamarUpdate[`kamar/${noKamar}/status`] = "terisi";
      }
    });

    await update(ref(db), kamar);
    console.log("Status kamar diperbarui berdasarkan penghuni.");
  } else {
    console.log("Tidak ada data penghuni.");
  }
}

document
  .getElementById("updateKamar")
  .addEventListener("click", updateStatusKamar);
