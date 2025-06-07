import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

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

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referensi ke database penghuni
const penghuniRef = ref(db, 'penghuni');
const tabel = document.getElementById('penghuniBody');

// Ambil data dari database dan tampilkan
onValue(penghuniRef, (snapshot) => {
  tabel.innerHTML = ''; // Kosongkan dulu
  let no = 1;

  snapshot.forEach((child) => {
    const data = child.val();
    const key = child.key; // Mendapatkan key dari snapshot
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-3 py-2 border text-center">${no++}</td>
      <td class="px-3 py-2 border">${data.nama || '-'}</td>
      <td class="px-3 py-2 border">${data.nomor_kamar || '-'}</td>
      <td class="px-3 py-2 border">${data.agama || '-'}</td>
      <td class="px-3 py-2 border">${data.alamat || '-'}</td>
      <td class="px-3 py-2 border">${data.warga_negara || '-'}</td>
      <td class="px-3 py-2 border">${data.tempat_lahir || '-'}</td>
      <td class="px-3 py-2 border">${data.tanggal_lahir || '-'}</td>
      <td class="px-3 py-2 border">${data.no_ktp || '-'}</td>
      <td class="px-3 py-2 border">${data.status_tempat_tinggal || '-'}</td>
      <td class="px-3 py-2 border">${data.jumlah_keluarga || '-'}</td>
      <td class="px-3 py-2 border">${data.status_perkawinan || '-'}</td>
      <td class="px-3 py-2 border">${data.pekerjaan || '-'}</td>
      <td class="px-3 py-2 border">${data.penghasilan || '-'}</td>
      <td class="px-3 py-2 border">${data.alamat_pekerjaan || '-'}</td>
      <td class="px-3 py-2 border">${data.pekerjaan_pasangan || '-'}</td>
      <td class="px-3 py-2 border">${data.penghasilan_pasangan || '-'}</td>
      <td class="px-3 py-2 border">${data.alamat_pekerjaan_pasangan || '-'}</td>
      <td class="px-3 py-2 border">${data.no_ktp_pasangan || '-'}</td>
      <td class="px-3 py-2 flex flex-col space-y-1">
          <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full" onclick="hapus('${key}')">Hapus</button>
        </td>
    `;
    tabel.appendChild(row);
  });
});

// Fungsi hapus data penghuni
window.hapus = function(key) {
  Swal.fire({
    title: 'Yakin ingin menghapus?',
    text: "Data ini akan dihapus secara permanen!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      const itemRef = ref(db, `penghuni/${key}`);
      remove(itemRef)
        .then(() => {
          Swal.fire({
            title: 'Berhasil!',
            text: 'Data berhasil dihapus.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        })
        .catch((error) => {
          console.error('Gagal menghapus data:', error);
          Swal.fire('Error', 'Terjadi kesalahan saat menghapus data.', 'error');
        });
    }
  });
};
