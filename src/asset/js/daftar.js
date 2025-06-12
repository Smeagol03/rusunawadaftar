import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
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

function escapeInput(str) {
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m])
  );
}

document
  .getElementById("form-pendaftaran")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;

    const data = {
      nama: escapeInput(form.nama.value),
      agama: escapeInput(form.agama?.value || ""),
      alamat: escapeInput(form.alamat?.value || ""),
      warga_negara: escapeInput(form.warga_negara?.value || ""),
      tempat_lahir: escapeInput(form.tempat_lahir?.value || ""),
      tanggal_lahir: escapeInput(form.tanggal_lahir?.value || ""),
      no_ktp: escapeInput(form.no_ktp.value),
      status_tempat_tinggal: escapeInput(
        form.status_tempat_tinggal?.value || ""
      ),
      jumlah_keluarga1: escapeInput(form.jumlah_keluarga1?.value || ""),
      jumlah_keluarga2: escapeInput(form.jumlah_keluarga2?.value || ""),
      jumlah_keluarga3: escapeInput(form.jumlah_keluarga3?.value || ""),
      jumlah_keluarga4: escapeInput(form.jumlah_keluarga4?.value || ""),
      status_perkawinan: escapeInput(form.status_perkawinan?.value || ""),
      pekerjaan: escapeInput(form.pekerjaan?.value || ""),
      penghasilan: escapeInput(form.penghasilan?.value || ""),
      nama_tempat_kerja: escapeInput(form.nama_tempat_kerja?.value || ""),
      alamat_pekerjaan: escapeInput(form.alamat_pekerjaan?.value || ""),
      pekerjaan_pasangan: escapeInput(form.pekerjaan_pasangan?.value || ""),
      penghasilan_pasangan: escapeInput(form.penghasilan_pasangan?.value || ""),
      alamat_pekerjaan_pasangan: escapeInput(
        form.alamat_pekerjaan_pasangan?.value || ""
      ),
      no_ktp_pasangan: escapeInput(form.no_ktp_pasangan?.value || ""),
      waktu: new Date().toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nik = data.no_ktp;

    // Tampilkan loading
    Swal.fire({
      title: "Memproses...",
      text: "Sedang mengirim data, mohon tunggu.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `pendaftaran/${nik}`));
      if (snapshot.exists()) {
        Swal.close(); // tutup loading
        Swal.fire({
          icon: "warning",
          title: "Gagal",
          text: "Nomor NIK sudah terdaftar!",
        });
      } else {
        await set(ref(db, `pendaftaran/${nik}`), data);
        Swal.close(); // tutup loading
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pendaftaran berhasil!",
        });
        form.reset();
      }
    } catch (error) {
      Swal.close(); // tutup loading
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: error.message,
      });
    }
  });
