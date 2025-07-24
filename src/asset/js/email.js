(function () {
  emailjs.init({
    publicKey: "Bu7YfN-RyEHeHgNu7",
  });
})();

document
  .getElementById("form-pendaftaran")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm("service_zgwei5g", "template_2olmd4n", this).then(
      () => {
        this.reset(); // hanya reset form jika sukses
      },
      (error) => {
        console.error(error); // hanya log error jika gagal
      }
    );
  });
