// Fungsi untuk mengekspor tabel pendaftar ke Excel dengan 2 sheet terpisah
document.addEventListener("DOMContentLoaded", function () {
  const exportBtn = document.getElementById("exportPendaftar");

  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      Swal.fire({
        title: "Memproses...",
        text: "Sedang menyiapkan file Excel",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const table = document.querySelector("table");
      const thead = table.querySelector("thead");
      const tbody = document.getElementById("pendaftarBody");

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

        // === HEADER UNTUK SHEET PENDAFTAR ===
        const headerCells = thead.querySelectorAll("th");
        const headerMap = {};
        headerCells.forEach((th, idx) => {
          headerMap[th.textContent.trim()] = idx;
        });

        const headerPendaftar = [];
        headerCells.forEach((th) => {
          const text = th.textContent.trim();
          if (
            ![
              "Anggota Keluarga",
              "Umur",
              "Hubungan",
              "Keterangan",
              "Aksi",
            ].includes(text)
          ) {
            headerPendaftar.push(text);
          }
        });

        const dataPendaftar = [headerPendaftar];

        // === HEADER UNTUK SHEET KELUARGA ===
        const headerKeluarga = [
          "No",
          "Nama Pendaftar",
          "No KTP Pendaftar",
          "Anggota Keluarga",
          "Umur",
          "Hubungan",
          "Keterangan",
        ];
        const dataKeluarga = [headerKeluarga];

        // === PROSES BARIS ===
        let currentNo = 1;
        let currentNama = "";
        let currentNoKTP = "";

        const rows = tbody.querySelectorAll("tr");
        rows.forEach((row) => {
          if (row.style.display !== "none") {
            const cells = row.querySelectorAll("td");
            const isFirstRow = cells[0]?.hasAttribute("rowspan") || false;

            if (isFirstRow) {
              // === DATA PENGHUNI UTAMA ===
              const rowData = [];
              headerPendaftar.forEach((h) => {
                let idx = headerMap[h];
                let cellText = cells[idx]?.textContent.trim() || "-";
                rowData.push(cellText);

                if (h === "Nama") currentNama = cellText;
                if (h === "No KTP") currentNoKTP = cellText;
                if (h === "No") currentNo = parseInt(cellText) || currentNo;
              });
              dataPendaftar.push(rowData);

              // === DATA KELUARGA (baris utama) ===
              let anggota =
                cells[headerMap["Anggota Keluarga"]]?.textContent.trim() || "-";
              let umur = cells[headerMap["Umur"]]?.textContent.trim() || "-";
              let hubungan =
                cells[headerMap["Hubungan"]]?.textContent.trim() || "-";
              let ket =
                cells[headerMap["Keterangan"]]?.textContent.trim() || "-";

              // Tambahkan data anggota keluarga jika ada nama yang valid
              if (anggota && anggota !== "-") {
                dataKeluarga.push([
                  currentNo,
                  currentNama,
                  currentNoKTP,
                  anggota,
                  umur,
                  hubungan,
                  ket,
                ]);
              }
            } else {
              // === DATA KELUARGA (baris lanjutan) ===
              // Baris lanjutan hanya memiliki 4 kolom: nama, umur, hubungan, keterangan
              if (cells.length >= 4) {
                let anggota = cells[0]?.textContent.trim() || "-";
                let umur = cells[1]?.textContent.trim() || "-";
                let hubungan = cells[2]?.textContent.trim() || "-";
                let ket = cells[3]?.textContent.trim() || "-";

                // Tambahkan data anggota keluarga jika ada nama yang valid
                if (anggota && anggota !== "-") {
                  dataKeluarga.push([
                    currentNo,
                    currentNama,
                    currentNoKTP,
                    anggota,
                    umur,
                    hubungan,
                    ket,
                  ]);
                }
              } else {
                console.warn(
                  "Baris lanjutan memiliki kolom tidak cukup:",
                  cells.length
                );
              }
            }
          }
        });

        // === BUAT WORKSHEET ===
        const worksheetPendaftar = XLSX.utils.aoa_to_sheet(dataPendaftar);
        worksheetPendaftar["!cols"] = headerPendaftar.map(() => ({ wch: 20 }));

        const worksheetKeluarga = XLSX.utils.aoa_to_sheet(dataKeluarga);
        worksheetKeluarga["!cols"] = headerKeluarga.map(() => ({ wch: 20 }));

        XLSX.utils.book_append_sheet(
          workbook,
          worksheetPendaftar,
          "Data Pendaftar"
        );
        XLSX.utils.book_append_sheet(
          workbook,
          worksheetKeluarga,
          "Anggota Keluarga"
        );

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
