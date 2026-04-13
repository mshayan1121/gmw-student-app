// ── BUDGET RUNNER — Phaser 3 Endless Runner ──────────────────────────────────

// ── Sounds (Web Audio API) ────────────────────────────────────────────────────
function brSound(type) {
  try {
    const AudioCtx = window.AudioContext || window['webkitAudioContext'];
    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (type === 'jump') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain); osc.start(); osc.stop(ctx.currentTime + 0.15);

    } else if (type === 'coin') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain); osc.start(); osc.stop(ctx.currentTime + 0.12);

    } else if (type === 'powerup') {
      const notes = [523, 659, 784];
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        g.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.15);
        o.connect(g); g.connect(ctx.destination);
        o.start(ctx.currentTime + i * 0.08);
        o.stop(ctx.currentTime + i * 0.08 + 0.15);
      });

    } else if (type === 'hurt') {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain); osc.start(); osc.stop(ctx.currentTime + 0.3);

    } else if (type === 'gameover') {
      const notes = [587, 494, 392, 294];
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
        g.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.18);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.2);
        o.connect(g); g.connect(ctx.destination);
        o.start(ctx.currentTime + i * 0.18);
        o.stop(ctx.currentTime + i * 0.18 + 0.22);
      });

    } else if (type === 'gold') {
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        g.gain.setValueAtTime(0.28, ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.22);
        o.connect(g); g.connect(ctx.destination);
        o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + 0.22);
      });
    }
  } catch (e) { /* AudioContext may be blocked; ignore */ }
}

// ── Phaser Game Handle ────────────────────────────────────────────────────────
let brGame = null;

function launchBudgetRunner() {
  if (brGame) { brGame.destroy(true); brGame = null; }
  requestAnimationFrame(() => {
    const wrap = document.getElementById('br-wrap');
    brGame = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'br-container',
      backgroundColor: '#5BB8F5',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [BRPreloadScene, BRGameScene, BRResultScene]
    });
  });
}

function destroyBudgetRunner() {
  if (brGame) { brGame.destroy(true); brGame = null; }
  // Clear HUD
  const livesEl = document.getElementById('br-lives');
  if (livesEl) livesEl.innerHTML = '';
  const aedEl = document.getElementById('br-aed');
  if (aedEl) aedEl.textContent = '0';
  const scoreEl = document.getElementById('br-score-hud');
  if (scoreEl) scoreEl.textContent = '0';
}

function exitBudgetRunner() {
  goTo('games'); // goTo() calls destroyBudgetRunner
}

// ── SCENE 1: Preload ──────────────────────────────────────────────────────────
class BRPreloadScene extends Phaser.Scene {
  constructor() { super({ key: 'BRPreloadScene' }); }

  preload() {
    const C = 'images/budget-runner/character/';
    const J = 'images/budget-runner/jumper/';

    // Character frames
    this.load.image('br-idle',   C + 'character_maleAdventurer_idle.png');
    this.load.image('br-run0',   C + 'character_maleAdventurer_run0.png');
    this.load.image('br-run1',   C + 'character_maleAdventurer_run1.png');
    this.load.image('br-run2',   C + 'character_maleAdventurer_run2.png');
    this.load.image('br-jump',   C + 'character_maleAdventurer_jump.png');
    this.load.image('br-fall',   C + 'character_maleAdventurer_fall.png');
    this.load.image('br-hurt',   C + 'character_maleAdventurer_hurt.png');
    this.load.image('br-cheer0', C + 'character_maleAdventurer_cheer0.png');
    this.load.image('br-cheer1', C + 'character_maleAdventurer_cheer1.png');

    // Ground & platforms
    this.load.image('br-ground',         J + 'ground_grass.png');
    this.load.image('br-ground-small',   J + 'ground_grass_small.png');
    this.load.image('br-ground-broken',  J + 'ground_grass_broken.png');

    // Obstacles
    this.load.image('br-mushroom',  J + 'mushroom_red.png');
    this.load.image('br-cactus',    J + 'cactus.png');
    this.load.image('br-spikeball', J + 'spikeBall1.png');
    this.load.image('br-spike',     J + 'spike_top.png');

    // Collectibles
    this.load.image('br-coin-gold',   J + 'coin_gold.png');
    this.load.image('br-coin-silver', J + 'coin_silver.png');
    this.load.image('br-coin-bronze', J + 'coin_bronze.png');
    this.load.image('br-jetpack',     J + 'jetpack_item.png');
    this.load.image('br-spring',      J + 'spring.png');

    // Parallax background layers
    this.load.image('br-bg1', J + 'bg_layer1.png');
    this.load.image('br-bg2', J + 'bg_layer2.png');
    this.load.image('br-bg3', J + 'bg_layer3.png');
    this.load.image('br-bg4', J + 'bg_layer4.png');

    // Medals
    this.load.image('br-medal-gold',   J + 'gold_1.png');
    this.load.image('br-medal-silver', J + 'silver_1.png');
    this.load.image('br-medal-bronze', J + 'bronze_1.png');

    // Lives icon
    this.load.image('br-lifes', J + 'lifes.png');

    // Sun decoration
    this.load.image('br-sun', J + 'sun1.png');

    // Suppress all asset load errors gracefully
    this.load.on('loaderror', () => {});
  }

  create() {
    this.scene.start('BRGameScene');
  }
}

// ── SCENE 2: Game ─────────────────────────────────────────────────────────────
class BRGameScene extends Phaser.Scene {
  constructor() { super({ key: 'BRGameScene' }); }

  init() {
    // Physics constants
    this.GRAVITY       = 2200;
    this.JUMP_VY       = -760;
    this.DBL_JUMP_VY   = -620;
    this.PLAYER_X      = 130;
    this.PLAYER_W      = 60;
    this.PLAYER_H      = 72;
    this.TILE_W        = 70;
    this.TILE_H        = 36;

    // Game state
    this.lives         = 3;
    this.score         = 0;
    this.aedSaved      = 0;
    this.elapsedTime   = 0;
    this.speedIncTimer = 0;
    this.scrollSpeed   = 240;
    this.spawnTimer    = 1.5;
    this.platSpawnTimer = 4.0;
    this.gameRunning   = true;
    this.gameEnding    = false;

    // Player physics
    this.playerY       = 0;
    this.playerVY      = 0;
    this.jumpCount     = 0;

    // Power-ups
    this.isInvincible  = false;
    this.invincibleTimer = 0;
    this.hasJetpack    = false;
    this.jetpackTimer  = 0;
    this.hasSpring     = false;
    this.springTimer   = 0;

    // Animation
    this.runFrame      = 0;
    this.runFrameTimer = 0;
    this.cheerFrame    = 0;
    this.cheerTimer    = 0;
    this.isCheer       = false;
    this.cheerDuration = 0;

    // Ground
    this.groundTiles   = [];
    this.gapCooldown   = 6;  // start with safe ground
    this.groundY       = 0;

    // Objects
    this.activeObjects = [];
    this.scorePopups   = [];
    this.platforms     = [];

    // Parallax layers
    this.bgLayers      = [];
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    this.groundY = Math.floor(H * 0.80);

    this._buildScene(W, H);

    // Input
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this._spaceWasDown = false;
    this.input.on('pointerdown', () => this._doJump());

    // Scale resize
    this.scale.on('resize', (size) => this._onResize(size.width, size.height));

    // Initial HUD
    this._updateLivesHUD();
    this._updateScoreHUD();
  }

  _buildScene(W, H) {
    this.groundY = Math.floor(H * 0.80);

    // ── Parallax background layers ────────────────────────────────────────────
    const bgKeys = ['br-bg1', 'br-bg2', 'br-bg3', 'br-bg4'];
    this.bgLayers = bgKeys.map(key => {
      const ts = this.add.tileSprite(0, 0, W, H, key).setOrigin(0, 0);
      // Scale to fill height
      const tex = this.textures.get(key);
      if (tex && tex.source[0]) {
        const imgH = tex.source[0].height;
        if (imgH > 0) ts.setScale(1, H / imgH);
      }
      return ts;
    });

    // Sun decoration (layer 1, top-right)
    const sunTex = this.textures.get('br-sun');
    if (sunTex && sunTex.source[0]) {
      this.sunImg = this.add.image(W - 80, 60, 'br-sun').setDisplaySize(70, 70).setAlpha(0.9);
    }

    // ── Ground tile pool ──────────────────────────────────────────────────────
    const numTiles = Math.ceil(W / this.TILE_W) + 6;
    this.groundTiles = [];
    for (let i = 0; i < numTiles; i++) {
      const x = i * this.TILE_W;
      const img = this.add.image(x + this.TILE_W / 2, this.groundY + this.TILE_H / 2, 'br-ground')
        .setDisplaySize(this.TILE_W, this.TILE_H);
      this.groundTiles.push({ img, x, isGap: false });
    }

    // ── Thin ground line below tiles (visual depth) ───────────────────────────
    this.groundLine = this.add.rectangle(W / 2, this.groundY + this.TILE_H + 1, W, 4, 0x2d5a1b).setOrigin(0.5, 0);

    // ── Player ────────────────────────────────────────────────────────────────
    this.playerY = this.groundY - this.PLAYER_H;
    this.playerImg = this.add.image(
      this.PLAYER_X,
      this.playerY + this.PLAYER_H / 2,
      'br-run0'
    ).setDisplaySize(this.PLAYER_W, this.PLAYER_H);
  }

  _onResize(W, H) {
    // Rebuild scene when canvas resizes (user resizes browser)
    this.activeObjects.forEach(o => { if (o.img) o.img.destroy(); if (o.labelTxt) o.labelTxt.destroy(); });
    this.scorePopups.forEach(p => { if (p.txt) p.txt.destroy(); });
    this.platforms.forEach(p => { if (p.img) p.img.destroy(); });
    this.groundTiles.forEach(t => { if (t.img) t.img.destroy(); });
    this.bgLayers.forEach(l => { if (l) l.destroy(); });
    if (this.sunImg) this.sunImg.destroy();
    if (this.playerImg) this.playerImg.destroy();
    if (this.groundLine) this.groundLine.destroy();

    this.activeObjects = [];
    this.scorePopups = [];
    this.platforms = [];
    this.groundTiles = [];
    this.bgLayers = [];
    this.gapCooldown = 6;

    this._buildScene(W, H);
  }

  update(time, delta) {
    if (!this.gameRunning) return;
    const dt = delta / 1000;
    const W = this.scale.width;
    const H = this.scale.height;

    // ── Time & speed ──────────────────────────────────────────────────────────
    this.elapsedTime   += dt;
    this.speedIncTimer += dt;
    if (this.speedIncTimer >= 15) {
      this.scrollSpeed = Math.min(this.scrollSpeed + 28, 520);
      this.speedIncTimer = 0;
    }

    // ── Parallax layers ───────────────────────────────────────────────────────
    const speeds = [0.08, 0.22, 0.45, 0.75];
    this.bgLayers.forEach((layer, i) => {
      if (layer) layer.tilePositionX += this.scrollSpeed * speeds[i] * dt;
    });

    // ── Ground tiles ──────────────────────────────────────────────────────────
    let maxTileX = -Infinity;
    this.groundTiles.forEach(t => { if (t.x > maxTileX) maxTileX = t.x; });

    this.groundTiles.forEach(tile => {
      tile.x -= this.scrollSpeed * dt;
      tile.img.x = tile.x + this.TILE_W / 2;

      // Recycle tile when it exits left
      if (tile.x + this.TILE_W < 0) {
        maxTileX += this.TILE_W;
        tile.x = maxTileX;
        tile.img.x = tile.x + this.TILE_W / 2;

        if (this.gapCooldown > 0) {
          this.gapCooldown--;
          tile.isGap = false;
          tile.img.setVisible(true);
        } else if (Math.random() < 0.10) {
          tile.isGap = true;
          tile.img.setVisible(false);
          this.gapCooldown = 5; // 5 solid tiles before next possible gap
        } else {
          tile.isGap = false;
          tile.img.setVisible(true);
        }
      }
    });

    // ── Player physics ────────────────────────────────────────────────────────
    if (this.hasJetpack) {
      this.jetpackTimer -= dt;
      if (this.jetpackTimer <= 0) { this.hasJetpack = false; }
      // Hover above obstacle height
      const targetY = this.groundY - this.PLAYER_H - 110;
      this.playerY += (targetY - this.playerY) * Math.min(1, dt * 8);
      this.playerVY = 0;
    } else {
      this.playerVY += this.GRAVITY * dt;
      this.playerY  += this.playerVY * dt;
    }

    // Spring timer
    if (this.hasSpring) {
      this.springTimer -= dt;
      if (this.springTimer <= 0) { this.hasSpring = false; }
    }

    // Ground collision
    const pLeft  = this.PLAYER_X - this.PLAYER_W * 0.3;
    const pRight = this.PLAYER_X + this.PLAYER_W * 0.3;
    const tilesUnder = this.groundTiles.filter(t =>
      !t.isGap &&
      t.x < pRight &&
      t.x + this.TILE_W > pLeft
    );

    if (tilesUnder.length > 0 && this.playerVY >= 0 && this.playerY + this.PLAYER_H >= this.groundY) {
      this.playerY   = this.groundY - this.PLAYER_H;
      this.playerVY  = 0;
      this.jumpCount = 0;
    }

    // Fall into gap
    if (this.playerY > H + 40) {
      if (!this.isInvincible && !this.gameEnding) {
        this._onHit();
        this._resetPlayerPos();
      } else if (this.isInvincible) {
        this._resetPlayerPos();
      }
    }

    // Clamp player above ceiling
    if (this.playerY < 0) { this.playerY = 0; this.playerVY = 0; }

    this.playerImg.y = this.playerY + this.PLAYER_H / 2;

    // ── Keyboard input (edge detection for space) ─────────────────────────────
    const spaceDown = this.jumpKey && this.jumpKey.isDown;
    if (spaceDown && !this._spaceWasDown) this._doJump();
    this._spaceWasDown = spaceDown;

    // ── Player animation ──────────────────────────────────────────────────────
    if (this.isCheer) {
      this.cheerTimer += dt;
      if (this.cheerTimer > 0.12) {
        this.cheerFrame = 1 - this.cheerFrame;
        this.cheerTimer = 0;
      }
      this.playerImg.setTexture(this.cheerFrame === 0 ? 'br-cheer0' : 'br-cheer1');
      this.cheerDuration -= dt;
      if (this.cheerDuration <= 0) this.isCheer = false;
    } else if (this.isInvincible && this.invincibleTimer > this.invincibleTimer - 0.5) {
      this.playerImg.setTexture('br-hurt');
    } else if (this.playerVY < -80) {
      this.playerImg.setTexture('br-jump');
    } else if (this.playerVY > 80) {
      this.playerImg.setTexture('br-fall');
    } else {
      // Run cycle
      this.runFrameTimer += dt;
      if (this.runFrameTimer >= 0.1) {
        this.runFrame = (this.runFrame + 1) % 3;
        this.runFrameTimer = 0;
      }
      const runFrameKeys = ['br-run0', 'br-run1', 'br-run2'];
      this.playerImg.setTexture(runFrameKeys[this.runFrame]);
    }

    // ── Invincibility flash ───────────────────────────────────────────────────
    if (this.isInvincible) {
      this.invincibleTimer -= dt;
      this.playerImg.alpha = (Math.floor(this.invincibleTimer * 10) % 2 === 0) ? 0.35 : 1.0;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
        this.playerImg.alpha = 1.0;
      }
    }

    // ── Spawn objects ─────────────────────────────────────────────────────────
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this._spawnObject(W, H);
      // Interval decreases as time goes on
      this.spawnTimer = Math.max(1.0, 2.4 - this.elapsedTime * 0.013);
    }

    // Floating platform spawner
    this.platSpawnTimer -= dt;
    if (this.platSpawnTimer <= 0 && this.elapsedTime > 8) {
      this._spawnPlatform(W, H);
      this.platSpawnTimer = Phaser.Math.Between(5, 10);
    }

    // ── Update active objects ─────────────────────────────────────────────────
    const toRemove = [];
    this.activeObjects.forEach(obj => {
      obj.x -= this.scrollSpeed * dt;
      obj.img.x = obj.x;
      if (obj.labelTxt) obj.labelTxt.x = obj.x;

      if (obj.x + obj.w < -30) {
        toRemove.push(obj);
        return;
      }

      if (!obj.collected && !obj.hit) {
        this._checkCollision(obj);
      }
    });
    toRemove.forEach(obj => {
      if (obj.img)      obj.img.destroy();
      if (obj.labelTxt) obj.labelTxt.destroy();
      const idx = this.activeObjects.indexOf(obj);
      if (idx !== -1) this.activeObjects.splice(idx, 1);
    });

    // ── Update floating platforms ─────────────────────────────────────────────
    const platRemove = [];
    this.platforms.forEach(plat => {
      plat.x -= this.scrollSpeed * dt;
      plat.img.x = plat.x + plat.w / 2;
      if (plat.x + plat.w < -30) platRemove.push(plat);
    });
    platRemove.forEach(p => {
      p.img.destroy();
      const idx = this.platforms.indexOf(p);
      if (idx !== -1) this.platforms.splice(idx, 1);
    });

    // ── Score popups ──────────────────────────────────────────────────────────
    const popRemove = [];
    this.scorePopups.forEach(popup => {
      popup.timer -= dt;
      popup.txt.y -= 45 * dt;
      popup.txt.alpha = Math.max(0, popup.timer / 0.75);
      if (popup.timer <= 0) popRemove.push(popup);
    });
    popRemove.forEach(p => {
      p.txt.destroy();
      const idx = this.scorePopups.indexOf(p);
      if (idx !== -1) this.scorePopups.splice(idx, 1);
    });

    // ── AED passive gain (1 per 2 seconds of surviving) ──────────────────────
    if (Math.floor(this.elapsedTime) > Math.floor(this.elapsedTime - dt) && Math.floor(this.elapsedTime) % 2 === 0) {
      this.aedSaved++;
    }

    // ── Update HTML HUD ───────────────────────────────────────────────────────
    this._updateScoreHUD();
  }

  _doJump() {
    if (!this.gameRunning || this.gameEnding) return;
    const canJump = this.jumpCount < 2 || this.hasSpring;
    if (!canJump) return;

    if (this.jumpCount === 0) {
      this.playerVY = this.JUMP_VY;
    } else {
      this.playerVY = this.DBL_JUMP_VY;
    }
    this.jumpCount = Math.min(this.jumpCount + 1, 2);
    brSound('jump');
  }

  _spawnObject(W, H) {
    const roll = Math.random();
    const spawnX = W + 60;

    if (roll < 0.65) {
      // Coin
      const coinRoll = Math.random();
      let key, pts, label;
      if (coinRoll < 0.60) { key = 'br-coin-bronze'; pts = 10;  label = 'Saved AED 10'; }
      else if (coinRoll < 0.90) { key = 'br-coin-silver'; pts = 25; label = 'Salary Bonus'; }
      else { key = 'br-coin-gold'; pts = 50; label = 'Smart Savings'; }

      const coinSize = 32;
      const elevate = Math.random() < 0.4 ? Phaser.Math.Between(40, 110) : 0;
      const coinY = this.groundY - this.PLAYER_H / 2 - coinSize / 2 - elevate;

      const img = this.add.image(spawnX, coinY, key).setDisplaySize(coinSize, coinSize);
      this.activeObjects.push({
        img, x: spawnX, y: coinY, w: coinSize, h: coinSize,
        type: 'coin', pts, label, collected: false, hit: false, labelTxt: null
      });

    } else if (roll < 0.70 && this.elapsedTime > 10) {
      // Powerup
      const isPowerup = Math.random() < 0.5;
      const key   = isPowerup ? 'br-jetpack' : 'br-spring';
      const label = isPowerup ? 'Investment!' : 'Side Hustle!';
      const ptype = isPowerup ? 'powerup-jetpack' : 'powerup-spring';
      const pw = 36, ph = 36;
      const pY = this.groundY - this.PLAYER_H - ph / 2;
      const img = this.add.image(spawnX, pY, key).setDisplaySize(pw, ph);

      this.activeObjects.push({
        img, x: spawnX, y: pY, w: pw, h: ph,
        type: ptype, pts: 0, label, collected: false, hit: false, labelTxt: null
      });

    } else {
      // Obstacle
      const types = [
        { key: 'br-mushroom',  label: 'Impulse Buy!', w: 36, h: 40 },
        { key: 'br-cactus',    label: 'Debt Trap!',   w: 32, h: 64 },
        { key: 'br-spikeball', label: 'Scam Alert!',  w: 38, h: 38 },
        { key: 'br-spike',     label: 'Late Fee!',    w: 56, h: 24 },
      ];
      const def = Phaser.Utils.Array.GetRandom(types);
      const obY = this.groundY - def.h / 2;
      const img = this.add.image(spawnX, obY, def.key).setDisplaySize(def.w, def.h);

      const labelTxt = this.add.text(spawnX, obY - def.h / 2 - 14, def.label, {
        fontFamily: 'Nunito, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#FF6B6B',
        stroke: '#000',
        strokeThickness: 2
      }).setOrigin(0.5, 1);

      this.activeObjects.push({
        img, labelTxt, x: spawnX, y: obY, w: def.w, h: def.h,
        type: 'obstacle', pts: 0, label: def.label, collected: false, hit: false
      });
    }
  }

  _spawnPlatform(W, H) {
    const pw = 100, ph = this.TILE_H;
    const platY = this.groundY - this.PLAYER_H - 70;
    const img = this.add.image(W + pw / 2, platY, 'br-ground-broken')
      .setDisplaySize(pw, ph);
    this.platforms.push({ img, x: W, y: platY, w: pw, h: ph });
  }

  _checkCollision(obj) {
    if (this.hasJetpack && obj.type === 'obstacle') return; // immune during jetpack

    const px1 = this.PLAYER_X - this.PLAYER_W * 0.28;
    const px2 = this.PLAYER_X + this.PLAYER_W * 0.28;
    const py1 = this.playerY + this.PLAYER_H * 0.1;
    const py2 = this.playerY + this.PLAYER_H * 0.9;

    const ox1 = obj.x - obj.w * 0.35;
    const ox2 = obj.x + obj.w * 0.35;
    const oy1 = obj.y - obj.h * 0.45;
    const oy2 = obj.y + obj.h * 0.45;

    const hit = px1 < ox2 && px2 > ox1 && py1 < oy2 && py2 > oy1;
    if (!hit) return;

    if (obj.type === 'obstacle') {
      obj.hit = true;
      this._onHit();
    } else if (obj.type === 'coin') {
      obj.collected = true;
      this._onCollect(obj);
    } else if (obj.type === 'powerup-jetpack') {
      obj.collected = true;
      this._onCollectPowerup(obj, 'jetpack');
    } else if (obj.type === 'powerup-spring') {
      obj.collected = true;
      this._onCollectPowerup(obj, 'spring');
    }
  }

  _onCollect(obj) {
    brSound('coin');
    this.score    += obj.pts;
    this.aedSaved += obj.pts;

    // Pop coin away
    this.tweens.add({
      targets: obj.img,
      scaleX: 2.0, scaleY: 2.0,
      alpha: 0,
      duration: 200,
      ease: 'Power2'
    });

    // Score popup text
    const pop = this.add.text(obj.x, obj.y - 20, '+' + obj.pts, {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '15px',
      fontStyle: '900',
      color: obj.pts >= 50 ? '#FFB800' : obj.pts >= 25 ? '#C0C0C0' : '#CD7F32',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5, 1);
    this.scorePopups.push({ txt: pop, timer: 0.75 });

    // Brief cheer if gold coin
    if (obj.pts >= 50) {
      this.isCheer = true;
      this.cheerDuration = 0.5;
      this.cheerFrame = 0;
      this.cheerTimer = 0;
    }
  }

  _onCollectPowerup(obj, ptype) {
    brSound('powerup');

    const pop = this.add.text(obj.x, obj.y - 20, ptype === 'jetpack' ? '🚀 JETPACK!' : '🌱 SPRING!', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#00C896',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5, 1);
    this.scorePopups.push({ txt: pop, timer: 1.0 });

    this.tweens.add({ targets: obj.img, alpha: 0, duration: 200 });

    if (ptype === 'jetpack') {
      this.hasJetpack = true;
      this.jetpackTimer = 3.0;
      this.score += 30;
    } else {
      this.hasSpring = true;
      this.springTimer = 5.0;
      this.jumpCount = 0; // reset so double jump is fresh
    }
  }

  _onHit() {
    if (this.isInvincible || this.gameEnding) return;
    this.lives--;
    brSound('hurt');
    this.isInvincible    = true;
    this.invincibleTimer = 1.6;
    this._updateLivesHUD();

    if (this.lives <= 0) {
      this.gameEnding = true;
      this.gameRunning = false;
      brSound('gameover');
      this.time.delayedCall(800, () => {
        this.scene.start('BRResultScene', {
          score:    this.score,
          aedSaved: this.aedSaved,
          elapsed:  this.elapsedTime
        });
      });
    }
  }

  _resetPlayerPos() {
    this.playerY  = this.groundY - this.PLAYER_H;
    this.playerVY = 0;
    this.jumpCount = 0;
  }

  _updateLivesHUD() {
    const el = document.getElementById('br-lives');
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const img = document.createElement('img');
      img.src = 'images/budget-runner/jumper/lifes.png';
      img.style.cssText = 'width:24px;height:24px;object-fit:contain;opacity:' + (i < this.lives ? '1' : '0.22') + ';filter:' + (i < this.lives ? 'none' : 'grayscale(1)');
      el.appendChild(img);
    }
  }

  _updateScoreHUD() {
    const scoreEl = document.getElementById('br-score-hud');
    const aedEl   = document.getElementById('br-aed');
    if (scoreEl) scoreEl.textContent = this.score;
    if (aedEl)   aedEl.textContent   = this.aedSaved;
  }
}

// ── SCENE 3: Result ───────────────────────────────────────────────────────────
class BRResultScene extends Phaser.Scene {
  constructor() { super({ key: 'BRResultScene' }); }

  init(data) {
    this.finalScore   = data.score   || 0;
    this.finalAed     = data.aedSaved || 0;
    this.finalElapsed = data.elapsed || 0;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Determine medal
    let medalKey, medalLabel, tipText, titleText;
    if (this.finalScore >= 1000) {
      medalKey   = 'br-medal-gold';
      medalLabel = 'Gold Saver!';
      titleText  = 'You\'re a Smart Saver!';
      tipText    = 'You\'re a Smart Saver!\nKeep avoiding debt traps and\nyour savings will grow fast.';
    } else if (this.finalScore >= 500) {
      medalKey   = 'br-medal-silver';
      medalLabel = 'Silver Saver';
      titleText  = 'Good Effort!';
      tipText    = 'Good effort! Watch out for\nimpulse buys next time —\nsmall wins add up!';
    } else {
      medalKey   = 'br-medal-bronze';
      medalLabel = 'Bronze Start';
      titleText  = 'Keep Learning!';
      tipText    = 'Debt traps caught you!\nLearn to spot them early —\nevery mistake is a lesson.';
    }

    // Dark overlay
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0a1e, 0.88);

    // Card background
    const cardW = Math.min(W - 40, 380);
    const cardH = Math.min(H - 60, 460);
    const cardX = W / 2;
    const cardY = H / 2;
    const card = this.add.graphics();
    card.fillStyle(0x1a1a3e, 1);
    card.fillRoundedRect(cardX - cardW / 2, cardY - cardH / 2, cardW, cardH, 18);
    card.lineStyle(2, 0x4B44CC, 1);
    card.strokeRoundedRect(cardX - cardW / 2, cardY - cardH / 2, cardW, cardH, 18);

    const top = cardY - cardH / 2 + 20;

    // Title
    this.add.text(cardX, top + 16, titleText, {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '22px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5, 0);

    // Medal image
    const medal = this.add.image(cardX, top + 85, medalKey);
    const mSize = 80;
    medal.setDisplaySize(mSize, mSize);

    // Medal label
    this.add.text(cardX, top + 135, medalLabel, {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: medalKey === 'br-medal-gold' ? '#FFB800' : medalKey === 'br-medal-silver' ? '#C0C0C0' : '#CD7F32'
    }).setOrigin(0.5, 0);

    // Stats row
    const statsY = top + 165;
    const col = cardW / 3;

    const statItems = [
      { label: 'Score',    value: String(this.finalScore) },
      { label: 'AED Saved', value: String(this.finalAed) },
      { label: 'Seconds',  value: String(Math.floor(this.finalElapsed)) }
    ];
    statItems.forEach((s, i) => {
      const sx = cardX - cardW / 2 + col * i + col / 2;
      this.add.text(sx, statsY, s.value, {
        fontFamily: 'Nunito, sans-serif',
        fontSize: '20px',
        fontStyle: '900',
        color: '#FFB800'
      }).setOrigin(0.5, 0);
      this.add.text(sx, statsY + 26, s.label, {
        fontFamily: 'Nunito, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: 'rgba(255,255,255,0.55)'
      }).setOrigin(0.5, 0);
    });

    // Divider
    const divY = statsY + 60;
    const divGfx = this.add.graphics();
    divGfx.lineStyle(1, 0x4B44CC, 0.5);
    divGfx.lineBetween(cardX - cardW / 2 + 20, divY, cardX + cardW / 2 - 20, divY);

    // Tip text
    const tipY = divY + 14;
    this.add.text(cardX, tipY, tipText, {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '12px',
      color: 'rgba(255,255,255,0.75)',
      align: 'center',
      lineSpacing: 4,
      wordWrap: { width: cardW - 40 }
    }).setOrigin(0.5, 0);

    // Buttons
    const btnY = cardY + cardH / 2 - 56;
    const btnW = (cardW - 48) / 2;

    // PLAY AGAIN
    const btnPlay = this.add.graphics();
    btnPlay.fillStyle(0x4B44CC, 1);
    btnPlay.fillRoundedRect(cardX - cardW / 2 + 16, btnY, btnW, 40, 10);
    this.add.text(cardX - cardW / 2 + 16 + btnW / 2, btnY + 20, 'PLAY AGAIN', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '13px',
      fontStyle: '900',
      color: '#ffffff'
    }).setOrigin(0.5, 0.5);
    const playHit = this.add.rectangle(cardX - cardW / 2 + 16 + btnW / 2, btnY + 20, btnW, 40)
      .setInteractive({ useHandCursor: true });
    playHit.on('pointerdown', () => {
      this.scene.start('BRGameScene');
    });
    playHit.on('pointerover', () => { btnPlay.clear(); btnPlay.fillStyle(0x6C63FF, 1); btnPlay.fillRoundedRect(cardX - cardW / 2 + 16, btnY, btnW, 40, 10); });
    playHit.on('pointerout',  () => { btnPlay.clear(); btnPlay.fillStyle(0x4B44CC, 1); btnPlay.fillRoundedRect(cardX - cardW / 2 + 16, btnY, btnW, 40, 10); });

    // BACK TO GAMES
    const btnBack = this.add.graphics();
    btnBack.fillStyle(0x2d2b55, 1);
    btnBack.lineStyle(1.5, 0x4B44CC, 1);
    btnBack.fillRoundedRect(cardX + 8, btnY, btnW, 40, 10);
    btnBack.strokeRoundedRect(cardX + 8, btnY, btnW, 40, 10);
    this.add.text(cardX + 8 + btnW / 2, btnY + 20, 'BACK TO GAMES', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '12px',
      fontStyle: '900',
      color: 'rgba(255,255,255,0.85)'
    }).setOrigin(0.5, 0.5);
    const backHit = this.add.rectangle(cardX + 8 + btnW / 2, btnY + 20, btnW, 40)
      .setInteractive({ useHandCursor: true });
    backHit.on('pointerdown', () => exitBudgetRunner());
    backHit.on('pointerover', () => { btnBack.clear(); btnBack.fillStyle(0x4B44CC, 0.4); btnBack.lineStyle(1.5, 0x4B44CC, 1); btnBack.fillRoundedRect(cardX + 8, btnY, btnW, 40, 10); btnBack.strokeRoundedRect(cardX + 8, btnY, btnW, 40, 10); });
    backHit.on('pointerout',  () => { btnBack.clear(); btnBack.fillStyle(0x2d2b55, 1); btnBack.lineStyle(1.5, 0x4B44CC, 1); btnBack.fillRoundedRect(cardX + 8, btnY, btnW, 40, 10); btnBack.strokeRoundedRect(cardX + 8, btnY, btnW, 40, 10); });

    // Cheer animation for gold/silver
    if (this.finalScore >= 500) {
      const cheerX = cardX + cardW / 2 - 45;
      const cheerY = cardY - cardH / 2 + 60;
      const cheerImg = this.add.image(cheerX, cheerY, 'br-cheer0').setDisplaySize(52, 65);
      let cf = 0;
      this.time.addEvent({
        delay: 180,
        loop: true,
        callback: () => {
          cf = 1 - cf;
          cheerImg.setTexture(cf === 0 ? 'br-cheer0' : 'br-cheer1');
        }
      });
    }

    // Confetti for gold
    if (this.finalScore >= 1000 && typeof window.confetti === 'function') {
      brSound('gold');
      window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors: ['#FFB800', '#4B44CC', '#00C896', '#FF6B6B'] });
    } else if (this.finalScore >= 500) {
      brSound('gold');
    } else {
      brSound('gameover');
    }
  }
}
