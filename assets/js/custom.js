// LD11 - kontaktų formos logika
const forma = document.getElementById('kontaktu-forma');
const siusti = document.getElementById('siusti');
const rezultatas = document.getElementById('rezultatas');
const laukai = ['vardas', 'pavarde', 'email', 'telefonas', 'adresas', 'k1', 'k2', 'k3'];

// Validacijos taisyklės: grąžina klaidos tekstą arba ''
const taisykles = {
  vardas: v => !v ? 'Įveskite vardą' : !/^\p{L}+$/u.test(v) ? 'Vardą gali sudaryti tik raidės' : '',
  pavarde: v => !v ? 'Įveskite pavardę' : !/^\p{L}+$/u.test(v) ? 'Pavardę gali sudaryti tik raidės' : '',
  email: v => !v ? 'Įveskite el. paštą' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Neteisingas el. pašto formatas' : '',
  telefonas: v => !v ? 'Įveskite telefono numerį' : !/^\+370 6\d\d \d{5}$/.test(v) ? 'Formatas: +370 6xx xxxxx' : '',
  adresas: v => !v ? 'Įveskite adresą' : '',
};
['k1', 'k2', 'k3'].forEach(k => {
  taisykles[k] = v => !v ? 'Įveskite įvertinimą' : !/^\d+$/.test(v) || v < 1 || v > 10 ? 'Įvertinimas turi būti nuo 1 iki 10' : '';
});

// Klaidų pranešimų elementai po kiekvienu lauku
laukai.forEach(n => {
  const div = document.createElement('div');
  div.className = 'field-error';
  forma.elements[n].insertAdjacentElement('afterend', div);
});

// Telefono formatavimas: tik skaitmenys, automatiškai +370 6xx xxxxx
function formatuotiTelefona(v) {
  if (v.startsWith('+370')) v = v.slice(4);
  let d = v.replace(/\D/g, '');
  if (d.startsWith('370') && d.length > 8) d = d.slice(3);
  d = d.slice(0, 8);
  if (!d) return '';
  return '+370 ' + d.slice(0, 3) + (d.length > 3 ? ' ' + d.slice(3) : '');
}

function reiksme(n) {
  return forma.elements[n].value.trim();
}

function tikrintiLauka(n) {
  const klaida = taisykles[n](reiksme(n));
  const el = forma.elements[n];
  el.classList.toggle('is-invalid', !!klaida);
  el.nextElementSibling.textContent = klaida;
}

function arVisiGeri() {
  return laukai.every(n => taisykles[n](reiksme(n)) === '');
}

laukai.forEach(n => {
  forma.elements[n].addEventListener('input', () => {
    if (n === 'telefonas') forma.elements[n].value = formatuotiTelefona(forma.elements[n].value);
    tikrintiLauka(n);
    siusti.disabled = !arVisiGeri();
  });
});

forma.addEventListener('submit', e => {
  e.preventDefault();
  if (!arVisiGeri()) return;

  const duomenys = {
    vardas: reiksme('vardas'),
    pavarde: reiksme('pavarde'),
    email: reiksme('email'),
    telefonas: reiksme('telefonas'),
    adresas: reiksme('adresas'),
    k1: Number(reiksme('k1')),
    k2: Number(reiksme('k2')),
    k3: Number(reiksme('k3')),
  };
  console.log(duomenys);

  const vidurkis = (duomenys.k1 + duomenys.k2 + duomenys.k3) / 3;
  const eilutes = [
    'Vardas: ' + duomenys.vardas,
    'Pavardė: ' + duomenys.pavarde,
    'El. paštas: ' + duomenys.email,
    'Tel. Numeris: ' + duomenys.telefonas,
    'Adresas: ' + duomenys.adresas,
    '1 klausimas: ' + duomenys.k1,
    '2 klausimas: ' + duomenys.k2,
    '3 klausimas: ' + duomenys.k3,
    duomenys.vardas + ' ' + duomenys.pavarde + ': ' + vidurkis.toFixed(2),
  ];
  rezultatas.innerHTML = '';
  eilutes.forEach(t => {
    const p = document.createElement('p');
    p.className = 'mb-1';
    p.textContent = t;
    rezultatas.appendChild(p);
  });
});

// Formos išvalymas be perkrovimo
document.getElementById('isvalyti').addEventListener('click', () => {
  forma.reset();
  laukai.forEach(n => {
    forma.elements[n].classList.remove('is-invalid');
    forma.elements[n].nextElementSibling.textContent = '';
  });
  rezultatas.innerHTML = '';
  siusti.disabled = true;
});
