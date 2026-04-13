// ── Mystery Box ───────────────────────────────────────────────────────────────
function initMysteryBox() {
  const card    = document.getElementById('mysteryBoxCard');
  const btn     = document.getElementById('mbOpenBtn');
  const iconWrap = document.getElementById('mb-gift-icon');
  if (!card || !btn || !iconWrap) return;

  // Inject gift icon via Lucide
  const ic = document.createElement('i');
  ic.setAttribute('data-lucide', 'gift');
  ic.style.cssText = 'width:32px;height:32px;color:#4B44CC;display:block';
  iconWrap.appendChild(ic);
  lucide.createIcons({ nodes: [ic] });

  // Already claimed this session?
  if (sessionStorage.getItem('rewardClaimed') === 'true') {
    _showMbClaimed(card, btn);
    return;
  }

  btn.addEventListener('click', function () {
    btn.style.display = 'none';

    // 1. Shake the gift icon
    iconWrap.classList.add('mb-icon-shake');

    setTimeout(function () {
      // 2. Pop the icon
      iconWrap.classList.remove('mb-icon-shake');
      iconWrap.classList.add('mb-icon-pop');

      // 3. Pick a random reward
      var rewards = [
        '⚡ 2x points activated for 10 minutes!',
        '🎁 50 bonus points added to your score!',
        '🛡️ Streak shield — miss a day, keep your streak!',
        '👑 Mystery avatar item unlocked!'
      ];
      var reward = rewards[Math.floor(Math.random() * rewards.length)];

      // 4. Swap content
      var content = card.querySelector('.mb-content');
      content.innerHTML =
        '<div class="mb-reward-text">' + reward + '</div>' +
        '<div class="mb-claimed-pill">✓ Reward claimed!</div>';

      // 5. Green card background
      card.classList.add('claimed');

      // 6. Persist so refresh shows claimed state
      sessionStorage.setItem('rewardClaimed', 'true');
    }, 400);
  });
}

function _showMbClaimed(card, btn) {
  btn.style.display = 'none';
  var content = card.querySelector('.mb-content');
  content.innerHTML =
    '<div class="mb-reward-text" style="font-size:13px;color:#0F6E56">You\'ve already claimed today\'s reward!</div>' +
    '<div class="mb-claimed-pill">✓ Reward claimed!</div>';
  card.classList.add('claimed');
}

// ── Rivalry Banner Icon ───────────────────────────────────────────────────────
function initRivalryBanner() {
  var zapEl = document.getElementById('rb-zap-icon');
  if (!zapEl) return;
  var ic = document.createElement('i');
  ic.setAttribute('data-lucide', 'zap');
  ic.style.cssText = 'width:16px;height:16px;color:#FFB800;display:block';
  zapEl.appendChild(ic);
  lucide.createIcons({ nodes: [ic] });
}

// ── School Vault ──────────────────────────────────────────────────────────────
function initVaultBar() {
  // Landmark icon
  var vaultIcon = document.getElementById('vault-landmark-icon');
  if (vaultIcon) {
    var ic = document.createElement('i');
    ic.setAttribute('data-lucide', 'landmark');
    ic.style.cssText = 'width:18px;height:18px;color:#4B44CC;display:block';
    vaultIcon.appendChild(ic);
    lucide.createIcons({ nodes: [ic] });
  }

  // Animate the fill bar when it enters the viewport
  var fill = document.getElementById('vaultFill');
  if (!fill) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        fill.style.width = '49%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(fill);
}
