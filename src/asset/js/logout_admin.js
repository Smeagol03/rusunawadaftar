import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
  import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

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

  // Cek login
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });

  // Logout handler
document.getElementById('logOut').addEventListener('click', () => {
  Swal.fire({
    title: 'Yakin ingin keluar?',
    text: "Anda akan diarahkan ke halaman login",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, keluar!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      signOut(auth).then(() => {
        window.location.href = "login.html";
      });
    }
  });
  });
