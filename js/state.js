// Shared application state
let totalPoints = 1240;

// ── Icon helpers ──────────────────────────────────────────────────────────────
// Append a single Lucide icon into element `id`
function si(id, name, sz, color) {
  const el = document.getElementById(id);
  if (!el) return;
  const ic = document.createElement('i');
  ic.setAttribute('data-lucide', name);
  ic.style.cssText = `width:${sz}px;height:${sz}px;color:${color};display:block`;
  el.appendChild(ic);
  lucide.createIcons({ nodes: [ic] });
}

// Append icon + text node (small, inline)
function st(id, icon, color, text) {
  const el = document.getElementById(id);
  if (!el) return;
  const ic = document.createElement('i');
  ic.setAttribute('data-lucide', icon);
  ic.style.cssText = `width:10px;height:10px;color:${color};display:inline-block;vertical-align:middle;margin-right:3px`;
  el.appendChild(ic);
  el.appendChild(document.createTextNode(text));
  lucide.createIcons({ nodes: [ic] });
}

// Append icon + text node (medium, inline)
function stxt(id, icon, color, text) {
  const el = document.getElementById(id);
  if (!el) return;
  const ic = document.createElement('i');
  ic.setAttribute('data-lucide', icon);
  ic.style.cssText = `width:12px;height:12px;color:${color};display:inline-block;vertical-align:middle;margin-right:4px`;
  el.appendChild(ic);
  el.appendChild(document.createTextNode(text));
  lucide.createIcons({ nodes: [ic] });
}

// Append icon + styled span (for change indicators)
function stch(id, icon, color, text) {
  const el = document.getElementById(id);
  if (!el) return;
  const ic = document.createElement('i');
  ic.setAttribute('data-lucide', icon);
  ic.style.cssText = `width:11px;height:11px;color:${color};display:inline-block;vertical-align:middle`;
  el.appendChild(ic);
  const t = document.createElement('span');
  t.style.cssText = 'font-size:10px;font-weight:800;margin-left:2px';
  t.textContent = text;
  el.appendChild(t);
  lucide.createIcons({ nodes: [ic] });
}

// Append icon + text node (large, inline)
function stxt2(id, icon, color, text) {
  const el = document.getElementById(id);
  if (!el) return;
  const ic = document.createElement('i');
  ic.setAttribute('data-lucide', icon);
  ic.style.cssText = `width:13px;height:13px;color:${color};display:inline-block;vertical-align:middle;margin-right:5px`;
  el.appendChild(ic);
  el.appendChild(document.createTextNode(text));
  lucide.createIcons({ nodes: [ic] });
}

// ── Icon initialisation ───────────────────────────────────────────────────────
// Called by router.js after all screen HTML has been injected into the DOM
function initIcons() {
  // Sidebar & topbar (always present)
  si('sbav', 'user', 14, '#FFB800');
  si('pav', 'user', 14, '#FFB800');

  // Dashboard screen
  si('hgi1', 'wallet', 26, '#6C63FF');
  si('hgi2', 'piggy-bank', 26, '#0F6E56');
  si('hgi3', 'brain', 26, '#854F0B');
  si('hsico', 'flame', 22, '#D85A30');
  ['hdc1', 'hdc2', 'hdc3'].forEach(id => si(id, 'check', 11, '#fff'));
  ['hla1', 'hla2', 'hla3', 'hla4'].forEach(id => si(id, 'user', 12, '#7B7B9A'));
  si('hb1', 'medal', 20, '#854F0B');
  si('hb2', 'zap', 20, '#854F0B');
  si('hb3', 'flame', 20, '#D85A30');
  si('hb4', 'check-circle', 20, '#0F6E56');
  si('hb5', 'trophy', 20, '#888780');
  si('hb6', 'star', 20, '#888780');
  si('hb7', 'flag', 20, '#888780');

  // Games screen
  si('gfiw', 'wallet', 48, 'rgba(255,255,255,.55)');
  si('gti1', 'wallet', 22, '#6C63FF');
  si('gti2', 'piggy-bank', 22, '#0F6E56');
  si('gti3', 'brain', 22, '#854F0B');
  si('gfpbi', 'play', 13, '#412402');
  stxt('gfm1', 'clock', 'rgba(255,255,255,.65)', '15 sec per round');
  stxt('gfm2', 'zap', 'rgba(255,255,255,.65)', '5 rounds');
  stxt('gfm3', 'star', 'rgba(255,255,255,.65)', 'Up to 80 pts');
  ['gla1', 'gla2'].forEach(id => si(id, 'user', 13, '#7B7B9A'));
  st('gsp2', 'lock', '#B4B2A9', 'Coming 16 May');
  st('gsp3', 'lock', '#B4B2A9', 'Coming 18 May');
  st('glm2', 'lock', '#B4B2A9', 'Unlocks 16 May');
  st('glm3', 'lock', '#B4B2A9', 'Unlocks 18 May');

  // Leaderboard screen
  si('lt1ico', 'trophy', 18, '#B8860B');
  si('lt2ico', 'trophy', 18, '#666');
  si('lt3ico', 'trophy', 18, '#8B5E3C');
  ['lt1av', 'lt2av', 'lt3av'].forEach(id => si(id, 'user', 16, '#7B7B9A'));
  ['lta1', 'lta2', 'lta3'].forEach(id => si(id, 'user', 14, '#7B7B9A'));
  stch('lc1', 'trending-up', '#0F6E56', '+2');
  stch('lc2', 'trending-up', '#0F6E56', '+1');
  stch('lc3', 'trending-up', '#0F6E56', '+3');

  // Rewards screen
  si('rwb1', 'medal', 22, '#854F0B');
  si('rwb2', 'zap', 22, '#854F0B');
  si('rwb3', 'flame', 22, '#D85A30');
  si('rwb4', 'check-circle', 22, '#0F6E56');
  si('rwb5', 'trophy', 22, '#888780');
  si('rwb6', 'star', 22, '#888780');
  si('rwb7', 'flag', 22, '#888780');
  si('rwb8', 'calendar', 22, '#888780');
  st('rwe1', 'check', '#0F6E56', 'Earned');
  st('rwe2', 'check', '#0F6E56', 'Earned');
  st('rwe3', 'check', '#0F6E56', 'Earned');
  st('rwe4', 'check', '#0F6E56', 'Earned');
  st('rwl5', 'lock', '#B4B2A9', 'Locked');
  st('rwl6', 'lock', '#B4B2A9', 'Locked');
  st('rwl7', 'lock', '#B4B2A9', '14 May');
  st('rwl8', 'lock', '#B4B2A9', 'Locked');
  si('rpi1', 'scroll-text', 20, '#854F0B');
  si('rpi2', 'party-popper', 20, '#534AB7');
  si('rpi4', 'users', 20, '#7B7B9A');
  st('rps1', 'clock', '#3C3489', 'In progress');

  // Certificate screen
  si('cseal', 'shield-check', 22, 'rgba(255,255,255,.7)');
  si('cprevico', 'eye', 13, '#4B44CC');
  si('cdlico', 'download', 13, '#fff');
  si('csi1', 'link', 13, '#4B44CC');
  si('csi2', 'message-circle', 13, '#0F6E56');
  si('csi3', 'mail', 13, '#854F0B');

  // Game screen — back button
  const gBackBtn = document.getElementById('gbackBtn');
  if (gBackBtn) {
    const backIc = document.createElement('i');
    backIc.setAttribute('data-lucide', 'arrow-left');
    backIc.style.cssText = 'width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:5px';
    gBackBtn.appendChild(backIc);
    gBackBtn.appendChild(document.createTextNode('Back to games'));
    lucide.createIcons({ nodes: [backIc] });
  }
}
