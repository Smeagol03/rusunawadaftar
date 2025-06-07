import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDdd1vFusi_RKEazwc2Pc7wP39HUD6WM5E",
    authDomain: "daftar-rusunawa.firebaseapp.com",
    databaseURL: "https://daftar-rusunawa-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "daftar-rusunawa",
    storageBucket: "daftar-rusunawa.firebasestorage.app",
    messagingSenderId: "529594513792",
    appId: "1:529594513792:web:8f4db9655d2cb6ca4e2965"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Escape input agar aman
function escapeInput(str) {
  return str.replace(/[&<>"'`=\/]/g, function (s) {
    return {
      '&': "&amp;",
      '<': "&lt;",
      '>': "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;",
      '/': "&#x2F;",
      '=': "&#x3D;"
    }[s];
  });
}

// Form login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = escapeInput(document.getElementById('email').value.trim());
  const password = escapeInput(document.getElementById('password').value.trim());

  if (!email || !password) {
    Swal.fire('Gagal', 'Email dan password wajib diisi.', 'warning');
    return;
  }

  Swal.fire({
    title: 'Sedang masuk...',
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false
  });

  try {
    await signInWithEmailAndPassword(auth, email, password);
    Swal.fire({
      icon: 'success',
      title: 'Berhasil Login!',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      window.location.href = "admin.html";
    });
  } catch (error) {
    Swal.fire('Login Gagal', 'Email atau password salah!', 'error');
    console.error("Login error:", error.code);
  }
});
