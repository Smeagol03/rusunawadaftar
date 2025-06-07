// Fungsi pencarian data pendaftar
document.addEventListener('DOMContentLoaded', function() {
    const inputCari = document.getElementById('cariPendaftar');
    
    if (inputCari) {
        inputCari.addEventListener('keyup', function() {
            const kataKunci = inputCari.value.toLowerCase();
            const tabelBody = document.getElementById('pendaftarBody');
            const barisTabel = tabelBody.getElementsByTagName('tr');
            
            // Loop melalui semua baris tabel
            for (let i = 0; i < barisTabel.length; i++) {
                const baris = barisTabel[i];
                const sel = baris.getElementsByTagName('td');
                let cocok = false;
                
                // Loop melalui semua sel dalam baris (kecuali kolom aksi)
                for (let j = 0; j < sel.length - 1; j++) {
                    const teks = sel[j].textContent || sel[j].innerText;
                    
                    // Jika teks dalam sel mengandung kata kunci pencarian
                    if (teks.toLowerCase().indexOf(kataKunci) > -1) {
                        cocok = true;
                        break;
                    }
                }
                
                // Tampilkan atau sembunyikan baris berdasarkan hasil pencarian
                if (cocok) {
                    baris.style.display = "";
                } else {
                    baris.style.display = "none";
                }
            }
        });
    }
});