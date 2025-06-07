document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("kirim-wa");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !message) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Data",
        text: "Nama dan pesan harus diisi.",
      });
      return;
    }

    const waNumber = "6281949788264";
    const text = `Halo, saya ${name}.%0A${encodeURIComponent(message)}`;
    const waUrl = `https://wa.me/${waNumber}?text=${text}`;

    window.open(waUrl, "_blank");
  });
});
