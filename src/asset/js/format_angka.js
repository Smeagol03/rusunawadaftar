const penghasilanInput = document.getElementById('penghasilan');
const penghasilanPasanganInput = document.getElementById('penghasilan_pasangan');

  // Format angka saat input
  penghasilanPasanganInput.addEventListener('input', function (e) {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, ''); // hanya angka
    e.target.value = formatRibuan(value);
  });

  penghasilanInput.addEventListener('input', function (e) {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, ''); // hanya angka
    e.target.value = formatRibuan(value);
  });

  function formatRibuan(angka) {
    return angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Fungsi untuk ambil nilai asli (tanpa koma)
  function getNumericValue(id) {
    return document.getElementById(id).value.replaceAll(',', '');
  }
