// Fungsi pencarian data pendaftar
document.addEventListener("DOMContentLoaded", function () {
  const inputCari = document.getElementById("cariPendaftar");

  if (inputCari) {
    inputCari.addEventListener("keyup", function () {
      const kataKunci = inputCari.value.toLowerCase();
      const semuaBaris = document.querySelectorAll(
        "#pendaftarBody tr[data-id]"
      );
      const semuaKey = new Set();

      // Temukan key data yang cocok
      semuaBaris.forEach((baris) => {
        const key = baris.getAttribute("data-id");
        if (!semuaKey.has(key)) {
          const barisPertama = document.querySelector(`tr[data-id="${key}"]`);
          const sel = barisPertama?.getElementsByTagName("td") || [];
          let cocok = false;

          for (let j = 0; j < sel.length - 1; j++) {
            const teks = sel[j].textContent || sel[j].innerText;
            if (teks.toLowerCase().includes(kataKunci)) {
              cocok = true;
              break;
            }
          }

          semuaKey.add(key);

          // Tampilkan/sembunyikan semua baris milik key yang sama
          document.querySelectorAll(`tr[data-id="${key}"]`).forEach((row) => {
            row.style.display = cocok ? "" : "none";
          });
        }
      });
    });
  }
});
