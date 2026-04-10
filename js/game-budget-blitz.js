const SCENARIOS = [
  {
    tag: 'FOOD & SAVINGS',
    q: 'You get AED 500 for the month. Lunch for 20 school days. Which saves you the most?',
    budget: 500,
    choices: [
      { icon: '🏠', name: 'Pack lunch from home',    sub: '~AED 5/day',   price: 100,  good: true,  fb: 'Smart! Packing lunch saves AED 200 vs buying every day.' },
      { icon: '🛒', name: 'Buy from school canteen', sub: '~AED 15/day',  price: 300,  good: false, fb: 'Works but costs AED 300 — 60% of your budget on lunch alone.' },
      { icon: '🍔', name: 'Order delivery daily',    sub: '~AED 40/day',  price: 800,  good: false, fb: "AED 800 — you'd run out in less than 2 weeks!" }
    ]
  },
  {
    tag: 'WANTS VS NEEDS',
    q: "Your phone screen cracked. You have AED 800. What's the smartest move?",
    budget: 800,
    choices: [
      { icon: '🔧', name: 'Repair the screen',        sub: 'Costs AED 150',  price: 150,  good: true,  fb: 'Excellent! Repairing saves AED 650 vs buying new. Needs vs wants!' },
      { icon: '📱', name: 'Buy a brand new phone',    sub: 'Costs AED 1,200', price: 1200, good: false, fb: 'Over budget by AED 400. Going into debt for a want is risky!' },
      { icon: '💸', name: 'Buy a refurbished phone',  sub: 'Costs AED 600',  price: 600,  good: false, fb: 'Not bad, but AED 600 when a AED 150 repair works is not smart.' }
    ]
  },
  {
    tag: 'SAVING HABIT',
    q: 'You earn AED 1,000 helping at a family business. Best way to handle it?',
    budget: 1000,
    choices: [
      { icon: '🏦', name: 'Save 70%, spend 30%',        sub: 'Save AED 700, enjoy AED 300', price: 300,  good: true,  fb: 'Perfect! The 70/30 rule — enjoy some now, build a safety net for later.' },
      { icon: '🛍️', name: 'Spend it all on wants',     sub: 'AED 1,000 spent',             price: 1000, good: false, fb: 'Leaves you nothing saved. Future-you will regret this!' },
      { icon: '🔒', name: 'Save every single dirham',  sub: 'AED 0 spent',                 price: 0,    good: false, fb: 'Great discipline but balance matters — small rewards keep you motivated.' }
    ]
  },
  {
    tag: 'SMART DEALS',
    q: 'You need school supplies. Same bag, 3 different shop prices. What do you do?',
    budget: 300,
    choices: [
      { icon: '🔍', name: 'Compare prices first',    sub: 'AED 85 at the discount shop',  price: 85,  good: true,  fb: "That's exactly what a Smart Money Talker does! Comparing prices is powerful." },
      { icon: '⚡', name: 'Buy nearest shop quickly', sub: 'AED 140 — convenience price', price: 140, good: false, fb: 'Convenience costs money! You paid AED 55 extra to save a few minutes.' },
      { icon: '✨', name: 'Buy the premium brand',    sub: 'AED 220 — branded version',   price: 220, good: false, fb: "Brand names don't always mean better quality. AED 135 more for the same function!" }
    ]
  },
  {
    tag: 'EMERGENCY FUND',
    q: "You saved AED 600. Friend invites you on a last-minute trip costing AED 550. Smart move?",
    budget: 600,
    choices: [
      { icon: '💰', name: 'Keep savings, skip trip',  sub: 'Stay at AED 600 saved',    price: 0,   good: true,  fb: 'Wise! Building an emergency fund matters more. Plan a trip you can afford later.' },
      { icon: '🎉', name: 'Go on the trip — YOLO!',  sub: 'Spend AED 550, left with AED 50', price: 550, good: false, fb: 'AED 50 left is almost no safety net. What if something breaks next month?' },
      { icon: '💳', name: 'Borrow money and go',     sub: 'Debt of AED 550 + interest', price: 0,   good: false, fb: 'Borrowing for wants creates debt. You pay back MORE than you borrowed. Avoid!' }
    ]
  }
];

const COLORS = ['#EEEDFE', '#E1F5EE', '#FFF8E0'];

// Game state
let cur = 0, score = 0, streak = 0, bestStreak = 0, answered = false;
let timerInt = null, timeLeft = 15, totalTime = 0, roundsCorrect = 0, roundStart = 0;

function loadRound() {
  answered = false;
  roundStart = Date.now();
  const s = SCENARIOS[cur];
  document.getElementById('gTag').textContent = s.tag;
  document.getElementById('gQ').textContent = s.q;
  document.getElementById('gBudget').textContent = 'AED ' + s.budget.toLocaleString();
  document.getElementById('gRemaining').textContent = 'AED ' + s.budget.toLocaleString();
  document.getElementById('gBudgetBar').style.width = '100%';
  document.getElementById('gBudgetBar').className = 'gbudget-fill';
  document.getElementById('gRoundNum').textContent = cur + 1;
  document.getElementById('gProgress').style.width = (cur / SCENARIOS.length * 100) + '%';
  document.getElementById('gFeedback').textContent = 'Choose the smartest option for your budget!';
  document.getElementById('gFeedback').className = 'gfeedback';
  document.getElementById('gNext').classList.remove('visible');

  const wrap = document.getElementById('gChoices');
  wrap.innerHTML = '';
  s.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'gchoice';
    btn.dataset.good = c.good;
    btn.innerHTML = `<div class="gchoice-left"><div class="gchoice-icon" style="background:${COLORS[i]}">${c.icon}</div><div><div class="gchoice-name">${c.name}</div><div class="gchoice-sub">${c.sub}</div></div></div><div class="gchoice-price ${c.price > s.budget ? 'bad' : c.good ? 'good' : ''}">AED ${c.price.toLocaleString()}</div>`;
    btn.onclick = () => pick(btn, c, s);
    wrap.appendChild(btn);
  });
  startTimer();
}

function startTimer() {
  timeLeft = 15;
  clearInterval(timerInt);
  updateTimer();
  timerInt = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) { clearInterval(timerInt); timerInt = null; if (!answered) timeUp(); }
  }, 1000);
}

function updateTimer() {
  const el = document.getElementById('gTimerNum');
  const ring = document.getElementById('gTimerRing');
  el.textContent = timeLeft;
  ring.classList.toggle('danger', timeLeft <= 5);
}

function timeUp() {
  answered = true;
  streak = 0;
  updateStreak();
  document.querySelectorAll('.gchoice').forEach(b => {
    b.classList.add('reveal', 'answered');
    if (b.dataset.good === 'true') b.classList.add('correct');
  });
  const good = SCENARIOS[cur].choices.find(c => c.good);
  showFb("Time's up! " + good.fb, false);
  document.getElementById('gNext').classList.add('visible');
}

function pick(btn, choice, scenario) {
  if (answered) return;
  answered = true;
  clearInterval(timerInt); timerInt = null;
  const elapsed = Math.round((Date.now() - roundStart) / 1000);
  totalTime += elapsed;
  document.querySelectorAll('.gchoice').forEach(b => {
    b.classList.add('reveal', 'answered');
    if (b.dataset.good === 'true') b.classList.add('correct');
  });
  const pct = Math.max(0, 100 - Math.round(choice.price / scenario.budget * 100));
  document.getElementById('gRemaining').textContent = 'AED ' + Math.max(0, scenario.budget - choice.price).toLocaleString();
  document.getElementById('gBudgetBar').style.width = pct + '%';
  if (pct < 30) document.getElementById('gBudgetBar').classList.add('low');
  if (choice.good) {
    btn.classList.add('correct');
    streak++; roundsCorrect++;
    if (streak > bestStreak) bestStreak = streak;
    const pts = timeLeft >= 10 ? 100 : timeLeft >= 5 ? 75 : 50;
    const bonus = streak > 1 ? (streak - 1) * 20 : 0;
    score += pts + bonus;
    totalPoints += pts + bonus;
    document.getElementById('gScore').textContent = score;
    document.getElementById('sbPts').textContent = totalPoints.toLocaleString();
    showFb('✓ ' + choice.fb, true);
    updateStreak();
  } else {
    btn.classList.add('wrong');
    btn.classList.add('shake');
    streak = 0; updateStreak();
    showFb('✗ ' + choice.fb, false);
  }
  document.getElementById('gNext').classList.add('visible');
}

function showFb(msg, good) {
  const el = document.getElementById('gFeedback');
  el.textContent = msg;
  el.className = 'gfeedback ' + (good ? 'correct-fb' : 'wrong-fb');
}

function updateStreak() {
  const el = document.getElementById('gStreakBadge');
  if (streak >= 2) { el.style.display = 'inline-block'; el.textContent = streak + '× streak!'; }
  else el.style.display = 'none';
}

function nextRound() {
  cur++;
  if (cur >= SCENARIOS.length) {
    showResult();
  } else {
    document.getElementById('gProgress').style.width = (cur / SCENARIOS.length * 100) + '%';
    loadRound();
  }
}

function showResult() {
  clearInterval(timerInt); timerInt = null;
  document.getElementById('gProgress').style.width = '100%';
  document.getElementById('gScenarioArea').style.display = 'none';
  document.getElementById('gResult').classList.add('active');
  const pct = Math.round(roundsCorrect / SCENARIOS.length * 100);
  const trophy = pct >= 80 ? '🏆' : pct >= 60 ? '🥈' : '🥉';
  const title  = pct >= 80 ? 'Money master!' : pct >= 60 ? 'Smart spender!' : 'Keep learning!';
  const sub    = pct >= 80
    ? 'You nailed it — Zoud would be proud!'
    : pct >= 60
    ? "Good thinking. A few more rounds and you'll be a pro."
    : 'Every round teaches you something. Try again!';
  document.getElementById('gTrophy').textContent = trophy;
  document.getElementById('gResultTitle').textContent = title;
  document.getElementById('gResultScore').textContent = score + ' pts';
  document.getElementById('gResultSub').textContent = sub;
  document.getElementById('grCorrect').textContent = roundsCorrect + '/' + SCENARIOS.length;
  document.getElementById('grStreak').textContent = bestStreak;
  document.getElementById('grTime').textContent = Math.round(totalTime / SCENARIOS.length) + 's';
  document.getElementById('certPts').textContent = totalPoints.toLocaleString();
  document.getElementById('rwPts').textContent = totalPoints.toLocaleString();
  document.getElementById('sbPts').textContent = totalPoints.toLocaleString();
}

function restartGame() {
  cur = 0; score = 0; streak = 0; bestStreak = 0; answered = false; totalTime = 0; roundsCorrect = 0;
  document.getElementById('gResult').classList.remove('active');
  document.getElementById('gScenarioArea').style.display = 'flex';
  loadRound();
}
