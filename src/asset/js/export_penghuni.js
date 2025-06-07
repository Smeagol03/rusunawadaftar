// Fungsi untuk mengekspor tabel pendaftar ke Excel
document.addEventListener('DOMContentLoaded', function() {
    // Ambil tombol export
    const exportBtn = document.getElementById('exportPenghuni');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // Tampilkan loading
            Swal.fire({
                title: 'Memproses...',
                text: 'Sedang menyiapkan file Excel',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Ambil tabel
            const table = document.querySelector('table');
            const thead = table.querySelector('thead');
            const tbody = document.getElementById('penghuniBody');
            
            // Cek apakah ada data
            if (tbody.rows.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Tidak ada data',
                    text: 'Tidak ada data pendaftar untuk diekspor'
                });
                return;
            }
            
            try {
                // Siapkan array untuk data Excel
                const workbook = XLSX.utils.book_new();
                const data = [];
                
                // Ambil header tabel
                const headerRow = [];
                const headerCells = thead.querySelectorAll('th');
                headerCells.forEach((cell, index) => {
                    // Skip kolom aksi (kolom terakhir)
                    if (index < headerCells.length - 1) {
                        headerRow.push(cell.textContent.trim());
                    }
                });
                data.push(headerRow);
                
                // Ambil data baris
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    // Hanya proses baris yang terlihat (jika ada filter pencarian aktif)
                    if (row.style.display !== 'none') {
                        const rowData = [];
                        const cells = row.querySelectorAll('td');
                        
                        // Ambil semua sel kecuali kolom aksi (kolom terakhir)
                        for (let i = 0; i < cells.length - 1; i++) {
                            rowData.push(cells[i].textContent.trim());
                        }
                        
                        data.push(rowData);
                    }
                });
                
                // Buat worksheet
                const worksheet = XLSX.utils.aoa_to_sheet(data);
                
                // Tambahkan worksheet ke workbook
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Penghuni Rusunawa');
                
                // Dapatkan tanggal saat ini untuk nama file
                const date = new Date();
                const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                
                // Ekspor ke file Excel
                XLSX.writeFile(workbook, `Penghuni_Rusunawa_${formattedDate}.xlsx`);
                
                // Tampilkan pesan sukses
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data pendaftar berhasil diekspor ke Excel'
                });
            } catch (error) {
                console.error('Error exporting to Excel:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat mengekspor data'
                });
            }
        });
    }
});