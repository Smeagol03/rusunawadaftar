// Fungsi untuk mengekspor tabel pendaftar ke Excel
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
        const data = [];

        // Ambil header tabel
        const headerRow = [];
        const headerCells = thead.querySelectorAll("th");
        headerCells.forEach((cell) => {
          headerRow.push(cell.textContent.trim());
        });
        data.push(headerRow);

        // Ambil data baris dari tbody
        const rows = tbody.querySelectorAll("tr");
        rows.forEach((row) => {
          if (row.style.display !== "none") {
            const rowData = [];
            const cells = row.querySelectorAll("td");
            // Jika ingin skip kolom aksi (tombol), gunakan slice(0, -1)
            cells.forEach((cell, idx) => {
              if (idx < cells.length - 1) rowData.push(cell.textContent.trim());
            });
            data.push(rowData);
          }
        });

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pendaftar Rusunawa");

        const date = new Date();
        const formattedDate = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;
        XLSX.writeFile(workbook, `Pendaftar_Rusunawa_${formattedDate}.xlsx`);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data pendaftar berhasil diekspor ke Excel",
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
