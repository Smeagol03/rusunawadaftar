import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  remove,
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

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//buka tutup modal
function bukaModalEdit() {
  document.getElementById("modal-edit").classList.remove("hidden");
}

// Referensi ke database penghuni
const penghuniRef = ref(db, "penghuni");
const tabel = document.getElementById("penghuniBody");

// Ambil data dari database dan tampilkan
onValue(penghuniRef, (snapshot) => {
  tabel.innerHTML = ""; // Kosongkan dulu
  let no = 1;

  // Ubah snapshot ke array dan urutkan berdasarkan nomor kamar
  const sortedChildren = [];
  snapshot.forEach((child) => sortedChildren.push(child));
  sortedChildren.sort((a, b) => {
    const roomA = a.val().nomor_kamar || "";
    const roomB = b.val().nomor_kamar || "";

    const [lantaiA, kamarA] = roomA.split("-").map(Number);
    const [lantaiB, kamarB] = roomB.split("-").map(Number);

    if (lantaiA === lantaiB) return kamarA - kamarB;
    return lantaiA - lantaiB;
  });

  sortedChildren.forEach((child) => {
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
              <button class="w-full bg-red-500 hover:bg-red-600 text-white px-2 py-1 mb-1 rounded-full" onclick="hapus('${key}')">Hapus</button>
              <button class="w-full bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-full" onclick="edit('${key}')">Edit</button>
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
          <button class="w-full bg-red-500 hover:bg-red-600 text-white px-2 py-1 mb-1 rounded-full" onclick="hapus('${key}')">Hapus</button>
          <button class="w-full bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-full" onclick="edit('${key}')">Edit</button>
        </td>
      `;
      tabel.appendChild(row);
    }
    no++;
  });
});

// Fungsi untuk membuka modal edit
window.edit = function (key) {
  const itemRef = ref(db, `penghuni/${key}`);
  get(itemRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      // Isi form edit dengan data dari Firebase
      document.getElementById("edit_nama").value = data.nama || "";
      document.getElementById("edit_nomor_kamar").value =
        data.nomor_kamar || "";
      document.getElementById("edit_agama").value = data.agama || "";
      document.getElementById("edit_alamat").value = data.alamat || "";
      document.getElementById("edit_warga_negara").value =
        data.warga_negara || "";
      document.getElementById("edit_tempat_lahir").value =
        data.tempat_lahir || "";
      document.getElementById("edit_tanggal_lahir").value =
        data.tanggal_lahir || "";
      document.getElementById("edit_no_ktp").value = data.no_ktp || "";
      document.getElementById("edit_status_tempat_tinggal").value =
        data.status_tempat_tinggal || "";
      document.getElementById("edit_status_perkawinan").value =
        data.status_perkawinan || "";
      document.getElementById("edit_pekerjaan").value = data.pekerjaan || "";
      document.getElementById("edit_penghasilan").value =
        data.penghasilan || "";
      document.getElementById("edit_nama_tempat_kerja").value =
        data.nama_tempat_kerja || "";
      document.getElementById("edit_alamat_pekerjaan").value =
        data.alamat_pekerjaan || "";
      document.getElementById("edit_pekerjaan_pasangan").value =
        data.pekerjaan_pasangan || "";
      document.getElementById("edit_penghasilan_pasangan").value =
        data.penghasilan_pasangan || "";
      document.getElementById("edit_alamat_pekerjaan_pasangan").value =
        data.alamat_pekerjaan_pasangan || "";
      document.getElementById("edit_no_ktp_pasangan").value =
        data.no_ktp_pasangan || "";

      // Tampilkan data keluarga
      const keluargaContainer = document.getElementById(
        "edit_anggota_keluarga"
      );
      keluargaContainer.innerHTML = ""; // Bersihkan dulu

      const keluarga = data.keluarga || [];

      for (let i = 0; i < 4; i++) {
        const anggota = keluarga[i] || {
          nama: "",
          umur: "",
          hubungan: "",
          keterangan: "",
        };

        const keluargaHTML = `
                                <div class="border p-3 rounded bg-gray-50 space-y-2">
                                  <label class="block text-sm font-semibold">Nama Keluarga ${
                                    i + 1
                                  }</label>
                                  <input type="text" class="w-full p-1 border rounded" name="edit_nama_keluarga${
                                    i + 1
                                  }" value="${anggota.nama}">

                                  <label class="block text-sm font-semibold">Umur</label>
                                  <input type="number" class="w-full p-1 border rounded" name="edit_umur_keluarga${
                                    i + 1
                                  }" value="${anggota.umur}">

                                  <label class="block text-sm font-semibold">Hubungan</label>
                                  <input type="text" class="w-full p-1 border rounded" name="edit_hubungan_keluarga${
                                    i + 1
                                  }" value="${anggota.hubungan}">

                                  <label class="block text-sm font-semibold">Keterangan</label>
                                  <input type="text" class="w-full p-1 border rounded" name="edit_keterangan_keluarga${
                                    i + 1
                                  }" value="${anggota.keterangan}">
                                </div>
                              `;
        keluargaContainer.insertAdjacentHTML("beforeend", keluargaHTML);
      }

      // Simpan key agar bisa digunakan saat menyimpan
      document.getElementById("form-edit").dataset.key = key;

      // Tampilkan modal edit
      bukaModalEdit();
    } else {
      Swal.fire("Data tidak ditemukan", "", "error");
    }
  });
};

// submit
document.getElementById("simpanEdit").addEventListener("click", function () {
  const updateData = {
    nama: document.getElementById("edit_nama").value,
    nomor_kamar: document.getElementById("edit_nomor_kamar").value,
    agama: document.getElementById("edit_agama").value,
    alamat: document.getElementById("edit_alamat").value,
    warga_negara: document.getElementById("edit_warga_negara").value,
    tempat_lahir: document.getElementById("edit_tempat_lahir").value,
    tanggal_lahir: document.getElementById("edit_tanggal_lahir").value,
    no_ktp: document.getElementById("edit_no_ktp").value,
    status_tempat_tinggal: document.getElementById("edit_status_tempat_tinggal")
      .value,
    status_perkawinan: document.getElementById("edit_status_perkawinan").value,
    pekerjaan: document.getElementById("edit_pekerjaan").value,
    penghasilan: document.getElementById("edit_penghasilan").value,
    nama_tempat_kerja: document.getElementById("edit_nama_tempat_kerja").value,
    alamat_pekerjaan: document.getElementById("edit_alamat_pekerjaan").value,
    pekerjaan_pasangan: document.getElementById("edit_pekerjaan_pasangan")
      .value,
    penghasilan_pasangan: document.getElementById("edit_penghasilan_pasangan")
      .value,
    alamat_pekerjaan_pasangan: document.getElementById(
      "edit_alamat_pekerjaan_pasangan"
    ).value,
    no_ktp_pasangan: document.getElementById("edit_no_ktp_pasangan").value,
  };

  // Ambil ulang array keluarga
  const keluarga = [];
  for (let i = 1; i <= 4; i++) {
    keluarga.push({
      nama:
        document.querySelector(`[name="edit_nama_keluarga${i}"]`)?.value || "",
      umur:
        document.querySelector(`[name="edit_umur_keluarga${i}"]`)?.value || "",
      hubungan:
        document.querySelector(`[name="edit_hubungan_keluarga${i}"]`)?.value ||
        "",
      keterangan:
        document.querySelector(`[name="edit_keterangan_keluarga${i}"]`)
          ?.value || "",
    });
  }

  updateData.keluarga = keluarga;

  const key = document.getElementById("form-edit").dataset.key;

  console.log("Key:", key);
  console.log("Data yang akan diupdate:", updateData);

  update(ref(db, `penghuni/${key}`), updateData)
    .then(() => {
      Swal.fire("Berhasil", "Data berhasil diperbarui", "success");
    })
    .catch((error) => {
      console.error("Gagal update data:", error);
      Swal.fire("Gagal", "Gagal menyimpan perubahan", "error");
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
