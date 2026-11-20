// LD12 - kompetencijų pažangos modulis
const statusai = ['Planuojama', 'Mokomasi', 'Atlikta'];
const pradiniai = [
  { name: 'PCB gamyba', status: 'Planuojama', xp: 30 },
  { name: 'Signalų apdorojimas', status: 'Planuojama', xp: 80 },
  { name: 'LTspice', status: 'Mokomasi', xp: 40 },
  { name: 'Python', status: 'Mokomasi', xp: 70 },
  { name: 'ESP32 programavimas', status: 'Mokomasi', xp: 60 },
  { name: 'Grandinių analizė', status: 'Atlikta', xp: 80 },
  { name: 'KiCad', status: 'Atlikta', xp: 50 },
  { name: 'Litavimas', status: 'Atlikta', xp: 40 },
];
const lygiai = [
  { lygis: 1, nuo: 0, rangas: 'Pradedantysis' },
  { lygis: 2, nuo: 50, rangas: 'Praktikantas' },
  { lygis: 3, nuo: 150, rangas: 'Specialistas' },
  { lygis: 4, nuo: 300, rangas: 'Profesionalas' },
];

// Būsenos iš Local Storage arba pradiniai duomenys
const skills = JSON.parse(localStorage.getItem('skills')) || pradiniai;
const $ = id => document.getElementById(id);

// 1. Kortelių atvaizdavimas
function rodytiKortelės() {
  document.querySelectorAll('.skill-card').forEach(k => k.remove());
  skills.forEach((s, i) => {
    const kortele = document.createElement('div');
    kortele.className = 'skill-card';
    const select = document.createElement('select');
    select.className = 'form-select form-select-sm';
    statusai.forEach(b => select.add(new Option(b, b, false, b === s.status)));
    select.addEventListener('change', () => keistiBusena(i, select.value));
    kortele.innerHTML = '<h4></h4><p></p>';
    kortele.querySelector('h4').textContent = s.name;
    kortele.querySelector('p').textContent = s.xp + ' XP';
    kortele.appendChild(select);
    document.querySelector('.kanban-column[data-status="' + s.status + '"]').appendChild(kortele);
  });
}

// 2. XP, lygio, rango ir progreso juostos skaičiavimas
function atnaujintiXp() {
  const xp = skills.filter(s => s.status === 'Atlikta').reduce((sum, s) => sum + s.xp, 0);
  const idx = lygiai.filter(l => xp >= l.nuo).length - 1;
  const dabar = lygiai[idx];
  const kitas = lygiai[idx + 1];
  const pct = kitas ? Math.round((xp - dabar.nuo) / (kitas.nuo - dabar.nuo) * 100) : 100;
  $('xp-total').textContent = xp + ' XP';
  $('level').textContent = dabar.lygis;
  $('rank').textContent = dabar.rangas;
  $('xp-text').textContent = kitas
    ? 'Progresas iki ' + kitas.lygis + ' lygio: ' + xp + ' / ' + kitas.nuo + ' XP'
    : 'Pasiektas aukščiausias lygis: ' + xp + ' XP';
  $('xp-fill').style.width = pct + '%';
  $('xp-fill').textContent = pct + '%';
}

// 3. Statistika
function atnaujintiStatistika() {
  const atlikta = skills.filter(s => s.status === 'Atlikta').length;
  $('stat-total').textContent = skills.length;
  $('stat-done').textContent = atlikta;
  $('stat-pct').textContent = Math.round(atlikta / skills.length * 100) + '%';
}

// 4. Būsenos keitimas
function keistiBusena(i, busena) {
  skills[i].status = busena;
  localStorage.setItem('skills', JSON.stringify(skills));
  atnaujintiVisa();
}

function atnaujintiVisa() {
  rodytiKortelės();
  atnaujintiXp();
  atnaujintiStatistika();
}

atnaujintiVisa();
