import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

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

const pendaftaranRef = ref(db, "pendaftaran");
const penghuniRef = ref(db, "penghuni");
const body = document.getElementById("pendaftarBody");

let counter = 1;
// Tampilkan data pendaftar
onValue(pendaftaranRef, (snapshot) => {
  body.innerHTML = "";
  snapshot.forEach((childSnap) => {
    const data = childSnap.val();
    const key = childSnap.key;

    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="px-3 py-2 border text-center">${counter}</td>
        <td class="px-3 py-2 border">${data.waktu}</td>
        <td class="px-3 py-2 border">${data.nama}</td>
        <td class="px-3 py-2 border">${data.agama}</td>
        <td class="px-3 py-2 border">${data.alamat}</td>
        <td class="px-3 py-2 border">${data.warga_negara}</td>
        <td class="px-3 py-2 border">${data.tempat_lahir}</td>
        <td class="px-3 py-2 border">${data.tanggal_lahir}</td>
        <td class="px-3 py-2 border">${data.no_ktp}</td>
        <td class="px-3 py-2 border">${data.status_tempat_tinggal}</td>
        <td class="px-3 py-2 border">${data.jumlah_keluarga}</td>
        <td class="px-3 py-2 border">${data.status_perkawinan}</td>
        <td class="px-3 py-2 border">${data.pekerjaan}</td>
        <td class="px-3 py-2 border">${data.penghasilan}</td>
        <td class="px-3 py-2 border">${data.alamat_pekerjaan}</td>
        <td class="px-3 py-2 border">${data.pekerjaan_pasangan}</td>
        <td class="px-3 py-2 border">${data.penghasilan_pasangan}</td>
        <td class="px-3 py-2 border">${data.alamat_pekerjaan_pasangan}</td>
        <td class="px-3 py-2 border">${data.no_ktp_pasangan}</td>
        <td class="px-3 py-6 border flex flex-col space-y-1">
          <button class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full" onclick="validasi('${key}')">Validasi</button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full" onclick="tolak('${key}')">Tolak</button>
        </td>
      `;
    body.appendChild(row);
    counter++;
  });
});

// Fungsi validasi dan pindahkan data
window.validasi = async function (key) {
  const itemRef = ref(db, `pendaftaran/${key}`);

  onValue(
    itemRef,
    async (snap) => {
      const data = snap.val();

      // Tampilkan modal untuk input nomor kamar
      const { value: nomorKamar } = await Swal.fire({
        title: "Masukkan Nomor Kamar",
        input: "text",
        inputLabel: "Nomor Kamar",
        inputPlaceholder: "Contoh: A-101",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Nomor kamar harus diisi!";
          }
        },
      });

      // Jika user membatalkan input
      if (!nomorKamar) {
        return;
      }

      // Tambahkan nomor kamar ke data
      const dataWithRoom = {
        ...data,
        nomor_kamar: nomorKamar,
      };

      // Tambahkan ke penghuni
      const newRef = push(penghuniRef);
      await set(newRef, dataWithRoom);

      // Hapus dari pendaftaran
      await remove(itemRef);

      Swal.fire({
        icon: "success",
        title: "Validasi Berhasil",
        text: `Data telah dipindahkan ke penghuni dengan nomor kamar ${nomorKamar}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    },
    { onlyOnce: true }
  );
};

window.tolak = function (key) {
  Swal.fire({
    title: "Yakin ingin menolak?",
    text: "Data ini akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      const itemRef = ref(db, `pendaftaran/${key}`);
      remove(itemRef)
        .then(() => {
          Swal.fire({
            title: "Berhasil!",
            text: "Data berhasil dihapus.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          // Optional: Refresh data setelah penghapusan
          setTimeout(() => {
            location.reload(); // atau panggil ulang fungsi fetch data
          }, 2000);
        })
        .catch((error) => {
          console.error("Gagal menghapus data:", error);
          Swal.fire("Error", "Terjadi kesalahan saat menghapus data.", "error");
        });
    }
  });
};
