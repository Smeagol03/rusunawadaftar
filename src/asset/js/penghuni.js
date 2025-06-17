import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  remove,
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

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referensi ke database penghuni
const penghuniRef = ref(db, "penghuni");
const tabel = document.getElementById("penghuniBody");

// Ambil data dari database dan tampilkan
onValue(penghuniRef, (snapshot) => {
  tabel.innerHTML = ""; // Kosongkan dulu
  let no = 1;

  snapshot.forEach((child) => {
    const data = child.val();
    const key = child.key;
    const keluarga = data.keluarga || [];
    const jumlahKeluarga = keluarga.length || 1;

    // Jika ada data keluarga, tampilkan per anggota
    if (keluarga.length > 0) {
      keluarga.forEach((anggota, idx) => {
        const row = document.createElement("tr");
        if (idx === 0) {
          row.innerHTML += `
            <td class="px-3 py-2 border text-center" rowspan="${jumlahKeluarga}">${no}</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.nama || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.nomor_kamar || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.agama || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.alamat || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.warga_negara || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.tempat_lahir || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.tanggal_lahir || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.no_ktp || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.status_tempat_tinggal || "-"
          }</td>
          `;
        }
        row.innerHTML += `
          <td class="px-3 py-2 border">${anggota.nama || "-"}</td>
          <td class="px-3 py-2 border">${anggota.umur || "-"}</td>
          <td class="px-3 py-2 border">${anggota.hubungan || "-"}</td>
          <td class="px-3 py-2 border">${anggota.keterangan || "-"}</td>
        `;
        if (idx === 0) {
          row.innerHTML += `
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.status_perkawinan || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.pekerjaan || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.penghasilan || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.nama_tempat_kerja || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.alamat_pekerjaan || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.pekerjaan_pasangan || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.penghasilan_pasangan || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.alamat_pekerjaan_pasangan || "-"
          }</td>
            <td class="px-3 py-2 border" rowspan="${jumlahKeluarga}">${
            data.no_ktp_pasangan || "-"
          }</td>
            <td class="px-3 text-center border" rowspan="${jumlahKeluarga}">
              <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full" onclick="hapus('${key}')">Hapus</button>
            </td>
          `;
        }
        tabel.appendChild(row);
      });
    } else {
      // Jika tidak ada data keluarga, tampilkan satu baris saja
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-3 py-2 border text-center">${no}</td>
        <td class="px-3 py-2 border">${data.nama || "-"}</td>
        <td class="px-3 py-2 border">${data.nomor_kamar || "-"}</td>
        <td class="px-3 py-2 border">${data.agama || "-"}</td>
        <td class="px-3 py-2 border">${data.alamat || "-"}</td>
        <td class="px-3 py-2 border">${data.warga_negara || "-"}</td>
        <td class="px-3 py-2 border">${data.tempat_lahir || "-"}</td>
        <td class="px-3 py-2 border">${data.tanggal_lahir || "-"}</td>
        <td class="px-3 py-2 border">${data.no_ktp || "-"}</td>
        <td class="px-3 py-2 border">${data.status_tempat_tinggal || "-"}</td>
        <td class="px-3 py-2 border">-</td>
        <td class="px-3 py-2 border">-</td>
        <td class="px-3 py-2 border">-</td>
        <td class="px-3 py-2 border">-</td>
        <td class="px-3 py-2 border">${data.status_perkawinan || "-"}</td>
        <td class="px-3 py-2 border">${data.pekerjaan || "-"}</td>
        <td class="px-3 py-2 border">${data.penghasilan || "-"}</td>
        <td class="px-3 py-2 border">${data.nama_tempat_kerja || "-"}</td>
        <td class="px-3 py-2 border">${data.alamat_pekerjaan || "-"}</td>
        <td class="px-3 py-2 border">${data.pekerjaan_pasangan || "-"}</td>
        <td class="px-3 py-2 border">${data.penghasilan_pasangan || "-"}</td>
        <td class="px-3 py-2 border">${
          data.alamat_pekerjaan_pasangan || "-"
        }</td>
        <td class="px-3 py-2 border">${data.no_ktp_pasangan || "-"}</td>
        <td class="px-3 text-center border">
          <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full" onclick="hapus('${key}')">Hapus</button>
        </td>
      `;
      tabel.appendChild(row);
    }
    no++;
  });
});

// Fungsi hapus data penghuni
window.hapus = function (key) {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Data ini akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      const itemRef = ref(db, `penghuni/${key}`);
      remove(itemRef)
        .then(() => {
          Swal.fire({
            title: "Berhasil!",
            text: "Data berhasil dihapus.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch((error) => {
          console.error("Gagal menghapus data:", error);
          Swal.fire("Error", "Terjadi kesalahan saat menghapus data.", "error");
        });
    }
  });
};
