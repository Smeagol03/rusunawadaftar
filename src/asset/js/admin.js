// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Konfigurasi Firebase (ganti dengan punyamu)
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

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Elemen HTML target
const kamarTerisiElem = document.getElementById("kamarTerisi");
const kamarKosongElem = document.getElementById("kamarKosong");
const totalKamar = document.getElementById("jumlahKamar");

const TOTAL_KAMAR = 42; // Total kamar yang tersedia

// Ambil jumlah penghuni dan hitung kamar
onValue(ref(db, "penghuni"), (snapshot) => {
  const jumlahPenghuni = snapshot.size || snapshot.numChildren();
  const kamarKosong = TOTAL_KAMAR - jumlahPenghuni;

  kamarTerisiElem.textContent = jumlahPenghuni;
  kamarKosongElem.textContent = kamarKosong >= 0 ? kamarKosong : 0;
  totalKamar.textContent = TOTAL_KAMAR;
});
