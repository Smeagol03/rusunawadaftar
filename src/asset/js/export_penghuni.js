document.addEventListener("DOMContentLoaded", function () {
  const exportBtn = document.getElementById("exportPenghuni");

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
      const tbody = document.getElementById("penghuniBody");

      if (tbody.rows.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Tidak ada data",
          text: "Tidak ada data penghuni untuk diekspor",
        });
        return;
      }

      try {
        const workbook = XLSX.utils.book_new();

        // Ambil semua header
        const headerCells = thead.querySelectorAll("th");
        const headerMap = {};
        headerCells.forEach((th, idx) => {
          headerMap[th.textContent.trim()] = idx;
        });

        // Header untuk sheet penghuni
        const headerPenghuni = [];
        headerCells.forEach((th, idx) => {
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
            headerPenghuni.push(text);
          }
        });

        // Header untuk sheet keluarga
        const headerKeluarga = [
          "No",
          "Nama Penghuni",
          "No KTP Penghuni",
          "Anggota Keluarga",
          "Umur",
          "Hubungan",
          "Keterangan",
        ];

        const dataPenghuni = [headerPenghuni];
        const dataKeluarga = [headerKeluarga];

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
              headerPenghuni.forEach((h) => {
                let idx = headerMap[h];
                let cellText = cells[idx]?.textContent.trim() || "-";
                rowData.push(cellText);

                if (h === "Nama") currentNama = cellText;
                if (h === "No KTP") currentNoKTP = cellText;
                if (h === "No") currentNo = parseInt(cellText) || currentNo;
              });
              dataPenghuni.push(rowData);

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

        // Buat worksheet penghuni
        const worksheetPenghuni = XLSX.utils.aoa_to_sheet(dataPenghuni);
        worksheetPenghuni["!cols"] = headerPenghuni.map(() => ({ wch: 20 }));

        // Buat worksheet keluarga
        const worksheetKeluarga = XLSX.utils.aoa_to_sheet(dataKeluarga);
        worksheetKeluarga["!cols"] = headerKeluarga.map(() => ({ wch: 20 }));

        XLSX.utils.book_append_sheet(
          workbook,
          worksheetPenghuni,
          "Data Penghuni"
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
        XLSX.writeFile(workbook, `Penghuni_Rusunawa_${formattedDate}.xlsx`);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data penghuni berhasil diekspor ke Excel dengan 2 sheet terpisah",
          timer: 2000,
          showConfirmButton: false,
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
