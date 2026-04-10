const titles = {
  home:        ['Good morning, Sara!', 'Wednesday · 13 May 2026 · Smart Money Talks'],
  games:       ['Games', 'Play, earn points, climb the leaderboard'],
  leaderboard: ['Leaderboard', 'See how you rank nationally, by emirate, and school'],
  rewards:     ['Rewards', 'Your badges, points, and unlockables'],
  certificate: ['Certificate', 'Your official GMW 2026 certificate'],
  game:        ['Budget Blitz', 'Round 1 of 5']
};

// ── Navigation ────────────────────────────────────────────────────────────────
function goTo(id) {
  if (timerInt) { clearInterval(timerInt); timerInt = null; }
  document.querySelectorAll('.screen, .game-screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('active'));
  const scr = document.getElementById('screen-' + id);
  if (scr) scr.classList.add('active');
  const navId = id === 'game' ? 'games' : id;
  const nav = document.getElementById('nav-' + navId);
  if (nav) nav.classList.add('active');
  const t = titles[id] || titles.games;
  document.getElementById('tb-title').textContent = t[0];
  document.getElementById('tb-sub').textContent = t[1];
  document.getElementById('mainTb').style.display = 'flex';
  document.getElementById('pmenu').classList.remove('open');
  menuOpen = false;
}

function launchGame() {
  if (timerInt) { clearInterval(timerInt); timerInt = null; }
  cur = 0; score = 0; streak = 0; bestStreak = 0; answered = false; totalTime = 0; roundsCorrect = 0;
  document.querySelectorAll('.screen, .game-screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-games').classList.add('active');
  document.getElementById('screen-game').classList.add('active');
  document.getElementById('mainTb').style.display = 'none';
  document.getElementById('gResult').classList.remove('active');
  document.getElementById('gScenarioArea').style.display = 'flex';
  loadRound();
}

function exitGame() {
  if (timerInt) { clearInterval(timerInt); timerInt = null; }
  goTo('games');
}

function switchTab(t) {
  document.querySelectorAll('.lb-tab').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + t).classList.add('active');
}

// ── Profile menu ──────────────────────────────────────────────────────────────
let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('pmenu').classList.toggle('open', menuOpen);
  document.getElementById('pchev').style.transform = menuOpen ? 'rotate(180deg)' : '';
}

document.addEventListener('click', e => {
  const pb = document.getElementById('profileBtn');
  if (pb && !pb.contains(e.target)) {
    document.getElementById('pmenu').classList.remove('open');
    document.getElementById('pchev').style.transform = '';
    menuOpen = false;
  }
});

// ── Boot: load all screen partials, then initialise ───────────────────────────
const SCREEN_FILES = [
  './screens/dashboard.html',
  './screens/games.html',
  './screens/game-budget-blitz.html',
  './screens/leaderboard.html',
  './screens/rewards.html',
  './screens/certificate.html'
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main-content');

  Promise.all(SCREEN_FILES.map(url => fetch(url).then(r => {
    if (!r.ok) throw new Error('Failed to load ' + url);
    return r.text();
  })))
    .then(htmls => {
      htmls.forEach(html => container.insertAdjacentHTML('beforeend', html));
      initIcons();
      goTo('games');
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = `
        <div style="padding:40px;color:#E24B4A;font-family:sans-serif;text-align:center">
          <strong>Could not load screen files.</strong><br><br>
          Open this app through a local web server, not directly from the filesystem.<br><br>
          <code>npx serve .</code> &nbsp;or&nbsp; <code>python -m http.server</code>
        </div>`;
    });
});
