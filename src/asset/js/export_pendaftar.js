// Fungsi untuk mengekspor tabel pendaftar ke Excel dengan 2 sheet terpisah
document.addEventListener("DOMContentLoaded", function () {
  // Ambil tombol export
  const exportBtn = document.getElementById("exportPendaftar");

  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      // Tampilkan loading
      Swal.fire({
        title: "Memproses...",
        text: "Sedang menyiapkan file Excel",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Ambil tabel
      const table = document.querySelector("table");
      const thead = table.querySelector("thead");
      const tbody = document.getElementById("pendaftarBody");

      // Cek apakah ada data
      if (tbody.rows.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Tidak ada data",
          text: "Tidak ada data pendaftar untuk diekspor",
        });
        return;
      }

      try {
        const workbook = XLSX.utils.book_new();
        
        // Data untuk sheet pendaftar (tanpa kolom keluarga)
        const dataPendaftar = [];
        // Data untuk sheet anggota keluarga
        const dataKeluarga = [];

        // Ambil header tabel untuk sheet pendaftar (tanpa kolom keluarga dan aksi)
        const headerPendaftar = [];
        const headerCells = thead.querySelectorAll("th");
        
        // Indeks kolom keluarga dan aksi
        const keluargaStartIdx = 10; // Indeks kolom "Anggota Keluarga"
        const keluargaEndIdx = 13;   // Indeks kolom "Keterangan"
        const aksiIdx = headerCells.length - 1; // Indeks kolom "Aksi"
        
        // Buat header untuk sheet pendaftar (tanpa kolom keluarga dan aksi)
        headerCells.forEach((cell, idx) => {
          if (idx < keluargaStartIdx || idx > keluargaEndIdx && idx !== aksiIdx) {
            headerPendaftar.push(cell.textContent.trim());
          }
        });
        dataPendaftar.push(headerPendaftar);

        // Buat header untuk sheet keluarga
        const headerKeluarga = [
          "No",
          "Nama Pendaftar", 
          "No KTP Pendaftar", 
          "Anggota Keluarga", 
          "Umur", 
          "Hubungan", 
          "Keterangan"
        ];
        dataKeluarga.push(headerKeluarga);

        // Ambil data baris dari tbody
        const rows = tbody.querySelectorAll("tr");
        let currentNo = 1;
        let currentNama = "";
        let currentNoKTP = "";
        let keluargaCounter = 1;

        rows.forEach((row) => {
          if (row.style.display !== "none") {
            const cells = row.querySelectorAll("td");
            const rowData = [];
            const dataId = row.getAttribute("data-id");
            
            // Cek apakah ini baris pertama dari pendaftar (dengan rowspan)
            const isFirstRow = cells[0]?.hasAttribute("rowspan") || false;
            
            if (isFirstRow) {
              // Ambil data pendaftar utama (tanpa kolom keluarga dan aksi)
              for (let i = 0; i < cells.length; i++) {
                // Jika ini adalah kolom pendaftar (bukan keluarga dan bukan aksi)
                if ((i < keluargaStartIdx || i > keluargaEndIdx + 9) && i !== cells.length - 1) {
                  // Ekstrak teks dari sel, termasuk jika ada tombol
                  let cellText = cells[i].textContent.trim();
                  rowData.push(cellText);
                  
                  // Simpan nama dan no KTP pendaftar untuk sheet keluarga
                  if (i === 2) currentNama = cellText; // Kolom Nama
                  if (i === 8) currentNoKTP = cellText; // Kolom No KTP
                }
              }
              dataPendaftar.push(rowData);
              currentNo = parseInt(cells[0].textContent.trim());
            }
            
            // Ambil data keluarga untuk sheet kedua
            const keluargaData = [];
            keluargaData.push(currentNo); // No
            keluargaData.push(currentNama); // Nama Pendaftar
            keluargaData.push(currentNoKTP); // No KTP Pendaftar
            
            // Ambil data anggota keluarga (4 kolom: nama, umur, hubungan, keterangan)
            for (let i = keluargaStartIdx; i <= keluargaEndIdx; i++) {
              // Hitung indeks yang benar berdasarkan struktur baris
              let cellIdx = isFirstRow ? i : i - keluargaStartIdx;
              let cellText = cells[cellIdx]?.textContent.trim() || "-";
              keluargaData.push(cellText);
            }
            
            // Hanya tambahkan ke dataKeluarga jika nama anggota keluarga tidak kosong
            if (keluargaData[3] && keluargaData[3] !== "-") {
              dataKeluarga.push(keluargaData);
              keluargaCounter++;
            }
          }
        });

        // Buat worksheet untuk data pendaftar
        const worksheetPendaftar = XLSX.utils.aoa_to_sheet(dataPendaftar);
        
        // Atur lebar kolom untuk sheet pendaftar
        const pendaftarColWidth = [
          { wch: 5 },  // No
          { wch: 20 }, // Tanggal
          { wch: 25 }, // Nama
          { wch: 15 }, // Agama
          { wch: 30 }, // Alamat
          { wch: 15 }, // Warga Negara
          { wch: 15 }, // Tempat Lahir
          { wch: 15 }, // Tanggal Lahir
          { wch: 20 }, // No KTP
          { wch: 20 }, // Status Tempat Tinggal
          { wch: 20 }, // Status Perkawinan
          { wch: 20 }, // Pekerjaan
          { wch: 15 }, // Penghasilan
          { wch: 25 }, // Nama Tempat Kerja
          { wch: 30 }, // Alamat Pekerjaan
          { wch: 20 }, // Pekerjaan Pasangan
          { wch: 15 }, // Penghasilan Pasangan
          { wch: 30 }, // Alamat Pekerjaan Pasangan
          { wch: 20 }  // No KTP Pasangan
        ];
        worksheetPendaftar['!cols'] = pendaftarColWidth;
        
        // Buat worksheet untuk data keluarga
        const worksheetKeluarga = XLSX.utils.aoa_to_sheet(dataKeluarga);
        
        // Atur lebar kolom untuk sheet keluarga
        const keluargaColWidth = [
          { wch: 5 },  // No
          { wch: 25 }, // Nama Pendaftar
          { wch: 20 }, // No KTP Pendaftar
          { wch: 25 }, // Anggota Keluarga
          { wch: 10 }, // Umur
          { wch: 15 }, // Hubungan
          { wch: 25 }  // Keterangan
        ];
        worksheetKeluarga['!cols'] = keluargaColWidth;

        // Tambahkan kedua worksheet ke workbook
        XLSX.utils.book_append_sheet(workbook, worksheetPendaftar, "Data Pendaftar");
        XLSX.utils.book_append_sheet(workbook, worksheetKeluarga, "Anggota Keluarga");

        const date = new Date();
        const formattedDate = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;
        XLSX.writeFile(workbook, `Pendaftar_Rusunawa_${formattedDate}.xlsx`);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data pendaftar berhasil diekspor ke Excel dengan 2 sheet terpisah",
        });
      } catch (error) {
        console.error("Error exporting to Excel:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat mengekspor data",
        });
      }
    });
  }
});
