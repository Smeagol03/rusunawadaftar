(function () {
  emailjs.init({
    publicKey: "taruh_disini",
  });
})();

document
  .getElementById("form-pendaftaran")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm("taruh_disini", "taruh disini", this).then(
      () => {
        this.reset(); // hanya reset form jika sukses
      },
      (error) => {
        console.error(error); // hanya log error jika gagal
      }
    );
  });
