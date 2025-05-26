
/* ---------------------------------------------------------
   1) 모든 수치를 한곳에 : SETTINGS
--------------------------------------------------------- */
const SETTINGS = {
	game: { W: 800, H: 600, duration: 180 },
	spawnEdgeMargin: 30,
	/* 플레이어 */
	player: {
		maxHP: 100,
		collideDmg: 10,
		speed: 200,
		fireRate: 200,   // ms
		iFrame: 100      // ms
	},

	/* 여러 무기(총알) 정의 */
	bulletTypes: {
		/* ───────── 1. 여러 구간에서 무작위 발사 ───────── */
		twinShot: {
			sprite: 'bullet',
			speed: 320, dmg: 9, life: 900,
			fireFactor: 1.2,               // player.fireRate × 이값(ms)
			mode: 'multi',                 // ← 발사 모드
			ranges: [[-10, 10], [170, 190]],
			hitR: 15,                       // 충돌 반지름(px)
			penetrate: 0
		},

		/* ───────── 2. 플레이어 이동방향 기반 회전 ───────── */
		laser: {
			sprite: 'bullet_arrow',
			speed: 380, dmg: 9, life: 1000,
			fireFactor: 1,
			mode: 'dir',                   // 방향 회전
			baseRange: [-30, 30],
			hitR: 15,
			penetrate: 0,
			error: 5                       // ±오차(deg)
		},

		/* ───────── 3. 원 궤도( Orbit ) ───────── */
		orbiter: {
			sprite: 'bullet_orb',
			speed: 200, dmg: 6, life: 5000,  // speed=0 (이동 X)
			fireFactor: 4,
			mode: 'orbit',
			orbit: { r: 80, omega: 360 },   // 반지름, 각속도(°/s)
			hitR: 12,
			penetrate: -1                  // 무한 관통 (적과만 충돌)
		},

		/* ───────── 4. 가장 가까운 적 + 오차 ───────── */
		seeker: {
			sprite: 'bullet_seek',
			speed: 450, dmg: 5, life: 800,
			fireFactor: 0.8,
			mode: 'seek',
			error: 15,                     // ±오차(deg)
			hitR: 8,
			penetrate: 0
		},

		sword: {
			sprite: 'bullet_sword',
			speed: 200, dmg: 12, life: 300,
			fireFactor: 1,
			mode: 'dir',                   // 방향 회전
			baseRange: [0, 1],
			hitR: 18,
			penetrate: -1,
			error: 5                       // ±오차(deg)
		},

		/* ───────── 5. N회 관통( Fireball + AOE ) ───────── */
		fireball: {
			sprite: 'bullet_fire',
			speed: 250, dmg: 1, life: 800,
			fireFactor: 2.5,
			mode: 'multi',
			ranges: [[-45, 45]],
			hitR: 15,
			penetrate: 0,
			aoe: { radius: 65, dmg: 12 }
		}
	},
	defaultBulletSet: ['twinShot'],

	/* 여러 적 정의 */
	enemyTypes: {
		slime: { sprite: 'enemy', baseHP: 3, hpPerLv: 2, speed: 60 },
		orc: { sprite: 'enemy_orc', baseHP: 8, hpPerLv: 4, speed: 20 },
		bat: { sprite: 'enemy_bat', baseHP: 2, hpPerLv: 1, speed: 100 },
		ice: { sprite: 'enemy_ice', baseHP: 200, hpPerLv: 10, speed: 50 }
	},
	enemySpawnOrder: ['slime', 'bat', 'orc'],  // 필요하면 확률/웨이브 로직으로 교체

	/* 스폰 주기 & 강화 주기 */
	spawn: { delayStart: 1200, delayMin: 100, accel: 0.99 },
	scaling: { interval: 5000, lvInc: 0.2 }
};

/* --- 업그레이드 풀 : 원하는 옵션을 PUSH 해서 무한히 늘릴 수 있음 --- */
const UPGRADE_POOL = [
	/* ① 공격 속도 ↓ */
	{
		txt: '공격 속도 ↑',
		act: g => {
			SETTINGS.player.fireRate = Math.max(40, SETTINGS.player.fireRate - 20);
			Object.keys(g.weaponTimers).forEach(key => {
				const base = SETTINGS.bulletTypes[key].fireFactor;
				g.weaponTimers[key].delay = base * SETTINGS.player.fireRate;
			});
		}
	},

	/* ② 플레이어 이동 속도 ↑ */
	{
		txt: '이동 속도 ↑',
		act: g => { SETTINGS.player.speed += 40; }
	},

	/* ③ 적 스폰 느리게 */
	{
		txt: '적 스폰 빠르게',
		act: g => { g.spawnEvent.delay -= 200; }
	},

	/* ④ 무기를 무작위로 교체 */
	{
		txt: '강화 : 불 뿜기',
		act: g => {
			if (!g.weaponSet.includes('fireball')) {
				g.weaponSet.push('fireball');
				g.addWeaponTimer('fireball');   // ← 전용 타이머 등록!
			} else {
				SETTINGS.bulletTypes.fireball.aoe.radius += 40;
				SETTINGS.bulletTypes.fireball.fireFactor *= 0.8;
			}
		}
	},
	{
		txt: '강화 : 파괴광선',
		act: g => {
			if (!g.weaponSet.includes('laser')) {
				g.weaponSet.push('laser');
				g.addWeaponTimer('laser');   // ← 전용 타이머 등록!
			} else {
				SETTINGS.bulletTypes.laser.fireFactor *= 0.7;
				SETTINGS.bulletTypes.laser.dmg *= 1.1;
			}
		}
	},
	{
		txt: '강화 : 슈리켄',
		act: g => {
			if (!g.weaponSet.includes('orbiter')) {
				g.weaponSet.push('orbiter');
				g.addWeaponTimer('orbiter');   // ← 전용 타이머 등록!
			} else {
				SETTINGS.bulletTypes.orbiter.life *= 1.5;
				SETTINGS.bulletTypes.orbiter.speed *= 1.3;
			}
		}
	},

	{
		txt: '강화 : 할퀴기',
		act: g => {
			if (!g.weaponSet.includes('sword')) {
				g.weaponSet.push('sword');
				g.addWeaponTimer('sword');   // ← 전용 타이머 등록!
			} else {
				SETTINGS.bulletTypes.sword.dmg *= 2;
				SETTINGS.bulletTypes.sword.hitR *= 1.2;
			}
		}
	},
	{
		txt: '강화 : 화살',
		act: g => {
			if (!g.weaponSet.includes('twinShot')) {
				g.weaponSet.push('twinShot');
				g.addWeaponTimer('twinShot');   // ← 전용 타이머 등록!
			} else {
				SETTINGS.bulletTypes.twinShot.dmg *= 1.5;
				SETTINGS.bulletTypes.twinShot.penetrate += 1;
			}
		}
	},

	{
		txt: '체력 완전회복',
		act: g => {
			g.hp = SETTINGS.player.maxHP;
		}
	},
	{
		txt: '강화 : 월광포화',
		act: g => {
			if (!g.weaponSet.includes('seeker')) {
				g.weaponSet.push('seeker');
				g.addWeaponTimer('seeker');   // ← 전용 타이머 등록!
			} else {
				SETTINGS.bulletTypes.seeker.penetrate += 1;
				SETTINGS.bulletTypes.seeker.dmg += 2;
			}
		}
	},

];

/* ---------------------------------------------------------
   2) Game 씬
--------------------------------------------------------- */
class Game extends Phaser.Scene {
	constructor() { super('Game'); }
	/* ---------------- 범위 데미지 ---------------- */
	explodeBullet(bullet) {
		if (bullet.getData('exploded')) return;      // 중복 방지
		bullet.setData('exploded', true);

		const aoe = bullet.getData('aoe');
		if (!aoe) return;                            // Fireball만 해당

		const { radius, dmg } = aoe;
		this.enemies.children.each(en => {
			if (Phaser.Math.Distance.Between(bullet.x, bullet.y, en.x, en.y) <= radius) {
				const hp = en.getData('hp') - dmg;
				if (hp <= 0) {
					en.destroy();
					const g = this.gems.create(en.x, en.y, 'gem');
					g.value = 1 + Math.floor(this.level * 0.2);
				} else {
					en.setData('hp', hp);
				}
			}
		});

		/* 폭발 이펙트용 그래픽(선택) */
		const boom = this.add.circle(bullet.x, bullet.y, radius, 0xffa500, 0.3);
		this.tweens.add({
			targets: boom, alpha: 0, scale: 1.5, duration: 200,
			onComplete: () => boom.destroy()
		});
	}

	preload() {
		/* 필수 스프라이트만 예시로 적어둡니다 */
		this.load.spritesheet('player', './assets/DinoSprites.png', {
			frameWidth: 24,
			frameHeight: 24
		});
		this.load.image('bullet', './assets/bullet.png');
		this.load.image('bullet_fire', './assets/fiame.png');
		this.load.image('bullet_arrow', './assets/laser.png');
		this.load.image('bullet_orb', './assets/suriken.png');
		this.load.image('bullet_seek', './assets/skeer.png');
		this.load.image('bullet_sword', './assets/kal.png');
		this.load.image('enemy', './assets/slime.png');
		this.load.image('enemy_orc', './assets/slime2.png');
		this.load.image('enemy_bat', './assets/slime3.png');
		this.load.image('gem', './assets/flack.png');
		this.load.image('background', './assets/bg2.jpg');
		this.load.image('ice', './assets/ice.png');
	}

	/* ----------------------------------------------------- */
	create() {
		this.add.image(SETTINGS.game.W / 2, SETTINGS.game.H / 2, 'background')
			.setOrigin(0.5)
			.setDepth(-1);
		/* 애니메이션 관련*/
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
			frameRate: 6,
			repeat: -1
		});

		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers('player', { start: 4, end: 9 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'hit',
			frames: [{ key: 'player', frame: 14 }],
			frameRate: 10
		});
		this.player = this.physics.add
			.sprite(SETTINGS.game.W / 2, SETTINGS.game.H / 2, 'player').setScale(2)
			.setCollideWorldBounds(true);
		this.player.play('idle');

		/*스코어 선언*/
		this.score = 0;
		/* ---------- 상태 ---------- */
		this.level = 1; this.nextXP = 10; this.xp = 0;
		this.hp = SETTINGS.player.maxHP; this.lastHit = 0;
		this.timeLeft = SETTINGS.game.duration;
		this.enemyLv = 1;                      // 전역 몬스터 레벨

		/* ---------- 오브젝트 ---------- */
		this.cursors = this.input.keyboard.createCursorKeys();
		this.bullets = this.physics.add.group();
		this.enemies = this.physics.add.group();
		this.gems = this.physics.add.group();


		/* ---------- HP 바 ---------- */
		this.hpBar = this.add.graphics();
		this.hpBarDepth = this.player.depth + 1;

		/* ---------- UI 텍스트 ---------- */
		this.timerText = this.add.text(16, 16, `빙하기 까지 -${this.timeLeft}백년`, { fontSize: 20, fill: '#fff' });

		/* ---------- 총알 발사 ---------- */
		this.weaponSet = [...SETTINGS.defaultBulletSet]; // 시작 무기 배열
		this.weaponTimers = {};                             // { weaponKey: TimerEvent }

		this.weaponSet.forEach(key => this.addWeaponTimer(key));

		/* ---------- 적 스폰 ---------- */
		this.spawnEvent = this.time.addEvent({
			delay: SETTINGS.spawn.delayStart, loop: true,
			callback: () => this.spawnEnemy()
		});

		/* ---------- 적 강화 ---------- */
		this.time.addEvent({
			delay: SETTINGS.scaling.interval, loop: true,
			callback: () => { this.enemyLv += SETTINGS.scaling.lvInc; }
		});

		/* ---------- 충돌 ---------- */
		this.physics.add.overlap(this.bullets, this.enemies, this.damageEnemy, null, this);
		this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);
		this.physics.add.overlap(this.player, this.gems, this.collectGem, null, this);

		/* ---------- 타이머 ---------- */
		this.time.addEvent({
			delay: 1000, loop: true,
			callback: () => {
			   this.timeLeft--;

			   // 빙하기 진입
			   if (this.timeLeft <= 0) {
				if (!SETTINGS.enemySpawnOrder.includes('ice')) {
				  SETTINGS.enemySpawnOrder.push('ice');
				  console.log('[빙하기] ice 몬스터가 출현합니다!');
				}
			     const coldFactor = -this.timeLeft / 30;

			     // 체력 점차 감소
			     this.hp = Math.max(0, this.hp - 1 * coldFactor);

			     // 속도 점차 감소 (최소치 제한)
			     SETTINGS.player.speed = Math.max(100, SETTINGS.player.speed - 5);

			     // 빙하기 효과 텍스트
			     this.timerText.setText(`빙하기 ${-this.timeLeft}년째`);
			   } else {
			     this.timerText.setText(`빙하기까지 ${this.timeLeft}백년`);
			   }
			}
		});
		/* 플레이어가 현재 보유한 무기들 */
		this.weaponSet = [...SETTINGS.defaultBulletSet];
		this.weaponTimers = {};           // 키: weapon, 값: TimerEvent
	}
	/* ---------- 무기별 타이머 생성 ---------- */
	addWeaponTimer(key) {
		/* 이미 타이머가 있다면 무시 */
		if (this.weaponTimers[key]) return;
		const base = SETTINGS.bulletTypes[key].fireFactor;
		const delay = base * SETTINGS.player.fireRate;

		this.weaponTimers[key] = this.time.addEvent({
			delay,
			loop: true,
			callback: () => this.fireWeapon(key)
		});
	}

	/* ---------- 1발 발사 ---------- */
	fireWeapon(key) {
		const t = SETTINGS.bulletTypes[key];
		const pos = { x: this.player.x, y: this.player.y };
		let deg;

		/* ── 각도 결정 ─────────────────── */
		switch (t.mode) {

			/* 여러 고정 구간 중 랜덤 */
			case 'multi': {
				const seg = Phaser.Utils.Array.GetRandom(t.ranges);
				const min = Math.min(seg[0], seg[1]);   // ← 정상화
				const max = Math.max(seg[0], seg[1]);
				deg = Phaser.Math.Between(min, max);
				break;
			}

			/* 플레이어 이동방향 기반 회전 */
			case 'dir': {
				const vx = this.player.body.velocity.x;
				const vy = this.player.body.velocity.y;
				const base = (vx === 0 && vy === 0)
					? 0
					: Phaser.Math.RadToDeg(Math.atan2(vy, vx));
				const min = base + t.baseRange[0];
				const max = base + t.baseRange[1];
				deg = Phaser.Math.Between(min, max);
				deg += Phaser.Math.Between(-t.error, t.error);
				break;
			}

			/* 가장 가까운 적 */
			case 'seek': {
				const target = this.enemies.getChildren().reduce((best, en) => {
					const d = Phaser.Math.Distance.BetweenPoints(pos, en);
					return (!best || d < best.d) ? { en, enX: en.x, enY: en.y, d } : best;
				}, null);
				deg = target
					? Phaser.Math.RadToDeg(
						Math.atan2(target.enY - pos.y, target.enX - pos.x))
					: Phaser.Math.Between(0, 360);
				deg += Phaser.Math.Between(-t.error, t.error);
				break;
			}

			/* 원 궤도 : 각도 0 고정, 이후 update()에서 궤도 회전 */
			case 'orbit': {
				deg = 0;
				break;
			}

			default: deg = Phaser.Math.Between(0, 360);
		}
		this.iceOverlay = this.add.rectangle(
		  SETTINGS.game.W / 2, SETTINGS.game.H / 2,
		  SETTINGS.game.W, SETTINGS.game.H,
		  0x66ccff, 0.2            // 파란색, 20% 불투명도
		).setDepth(100).setVisible(false);

		/* ── 총알 생성 ─────────────────── */

		const b = this.bullets.create(pos.x, pos.y, t.sprite)
			.setDataEnabled();
		b.lifespan = t.life;
		b.setCircle(t.hitR);
		b.setData({
			dmg: t.dmg, type: key, aoe: t.aoe || null,
			penetrate: t.penetrate, mode: t.mode
		});

		if (t.mode === 'orbit') {
			b.setData('theta', 0);                   // 각도 초기화
			b.body.setEnable(false);
		} else {
			const rad = Phaser.Math.DegToRad(deg);
			this.physics.velocityFromRotation(rad, t.speed, b.body.velocity);
		}
	}
	/* ----------------------------------------------------- */
	update(_, dt) {
		if (this.timeLeft <= 0) {
		  this.iceOverlay.setVisible(true);
		} else {
		  this.iceOverlay.setVisible(false);
		}
		this.iceOverlay.setAlpha(Math.min(0.8, 0.2 + (-this.timeLeft / 500)));

		/* --- 플레이어 이동 --- */
		const v = SETTINGS.player.speed;
		const vx = (this.cursors.left.isDown ? -v : 0) + (this.cursors.right.isDown ? v : 0);
		const vy = (this.cursors.up.isDown ? -v : 0) + (this.cursors.down.isDown ? v : 0);

		this.player.setVelocity(vx, vy);

		// 좌우 방향에 따라 반전
		if (vx !== 0) this.player.setFlipX(vx < 0);

		// 애니메이션 전환
		if (vx !== 0 || vy !== 0) {
			if (this.player.anims.currentAnim?.key !== 'run') this.player.play('run', true);
		} else {
			if (this.player.anims.currentAnim?.key !== 'idle') this.player.play('idle', true);
		}

		/* --- 적 추적 --- */
		const eSpeedCache = {};         // 타입별 속도 캐시
		this.enemies.children.each(en => {
			const t = SETTINGS.enemyTypes[en.getData('type')];
			if (!eSpeedCache[t.sprite]) eSpeedCache[t.sprite] = t.speed;
			this.physics.moveToObject(en, this.player, eSpeedCache[t.sprite]);
		});

		/* --- 총알 수명 --- */
		const dtS = dt / 1000;              // ← Δt(초) 한 번만 계산
		this.bullets.children.each(b => {
			if (b.getData('mode') === 'orbit') {
				const o = SETTINGS.bulletTypes[b.getData('type')].orbit;
				const th = b.getData('theta') + o.omega * dtS;
				b.setData('theta', th);
				const rad = Phaser.Math.DegToRad(th);
				const nx = this.player.x + o.r * Math.cos(rad);
				const ny = this.player.y + o.r * Math.sin(rad);
				b.setPosition(nx, ny);          // 스프라이트 위치
				b.body?.reset(nx, ny);          // ← body 좌표도 동기화!
			}
			b.lifespan -= dt;
			if (b.lifespan <= 0) {
				this.explodeBullet(b);
				b.destroy();
			}
		});

		/* --- HP 바 갱신 --- */
		this.drawHpBar();
	}

	/* ============ 총알 발사 ============ */
	fireAllWeapons() {
		this.weaponSet.forEach(key => {
			const t = SETTINGS.bulletTypes[key];
			/* 발사각 계산 */
			let [min, max] = t.angle;
			if (max <= min) { min = 0; max = 360; }        // 잘못 넣으면 360°
			const deg = Phaser.Math.Between(min, max);
			const rad = Phaser.Math.DegToRad(deg);
			const bullet = this.bullets.create(this.player.x, this.player.y, t.sprite);
			this.physics.velocityFromRotation(rad, t.speed, bullet.body.velocity);
			bullet.lifespan = t.life;
			bullet.setData('dmg', t.dmg);
			bullet.setData('mode', t.mode);
		});
	}

	/* ============ 적 스폰 ============ */
	spawnEnemy() {
		const list = SETTINGS.enemySpawnOrder;
		const typeKey = list[Phaser.Math.Between(0, list.length - 1)];
		const t = SETTINGS.enemyTypes[typeKey];
		const M = SETTINGS.spawnEdgeMargin;       // 외곽 여유
		const { W, H } = SETTINGS.game;

		/* 0=left, 1=right, 2=top, 3=bottom 중 택1 */
		const side = Phaser.Math.Between(0, 3);
		let x, y;

		switch (side) {
			case 0:  // left
				x = -M;
				y = Phaser.Math.Between(0, H);
				break;
			case 1:  // right
				x = W + M;
				y = Phaser.Math.Between(0, H);
				break;
			case 2:  // top
				x = Phaser.Math.Between(0, W);
				y = -M;
				break;
			case 3:  // bottom
				x = Phaser.Math.Between(0, W);
				y = H + M;
				break;
		}

		const en = this.enemies.create(x, y, t.sprite);
		en.setData('type', typeKey);
		en.setData('hp', t.baseHP + t.hpPerLv * this.enemyLv);

		/* 스폰 간격 가속 */
		this.spawnEvent.delay = Math.max(
			SETTINGS.spawn.delayMin,
			this.spawnEvent.delay * SETTINGS.spawn.accel
		);
	}

	/* ============ 충돌 ============ */
	damageEnemy(bullet, enemy) {
		const hp = enemy.getData('hp') - bullet.getData('dmg');
		this.explodeBullet(bullet);                 // AOE 우선

		if (hp <= 0) {
			enemy.destroy();
			this.score += 5
			const g = this.gems.create(enemy.x, enemy.y, 'gem');
			g.value = 1 + Math.floor(this.level * 0.2);
		} else { enemy.setData('hp', hp); }

		/* 관통 카운트 */
		let pen = bullet.getData('penetrate');
		if (pen >= 0) {
			pen -= 1;
			bullet.setData('penetrate', pen);
			if (pen < 0) {
				bullet.setActive(false).setVisible(false);
				bullet.destroy();
			}
		}
	}
	playerHit() {
		this.player.play('hit');
		this.time.delayedCall(200, () => {
			this.player.play('idle');
		});
		const now = this.time.now;
		if (now - this.lastHit < SETTINGS.player.iFrame) return;
		this.lastHit = now;

		this.hp -= SETTINGS.player.collideDmg;
		if (this.hp <= 0) return this.gameOver();
	}

	/* ============ Gem 수집 & 레벨업 ============ */
	collectGem(_, gem) {
		this.xp += gem.value; gem.destroy();
		if (this.xp >= this.nextXP) {
			this.xp -= this.nextXP; this.nextXP = Math.floor(this.nextXP * 1.3);
			this.level++;
			this.score += this.level * 10
			this.hp = Math.min(SETTINGS.player.maxHP, this.hp + 10);
			this.scene.pause(); this.scene.launch('Upgrade');
		}
	}

	/* ============ HP 바 그리기 ============ */
	drawHpBar() {
		const barW = 40, barH = 6, offsetY = 40;
		this.hpBar.clear();
		this.hpBar.fillStyle(0xff0000).fillRect(
			this.player.x - barW / 2,
			this.player.y - offsetY,
			barW, barH
		);
		const ratio = this.hp / SETTINGS.player.maxHP;
		this.hpBar.fillStyle(0x00ff00).fillRect(
			this.player.x - barW / 2,
			this.player.y - offsetY,
			barW * ratio, barH
		);
		this.hpBar.depth = this.player.depth + 1;   // 항상 위에
	}

	/* ============ 게임 오버 ============ */
	gameOver() {
		this.scene.pause();
		this.score += SETTINGS.game.duration - this.timeLeft
		this.add.text(
			SETTINGS.game.W / 2,
			SETTINGS.game.H / 2 - 40,
			`GAME OVER\nScore : ${this.score}`,
			{ fontSize: 48, fill: '#f00', align: 'center' }
		).setOrigin(0.5)
		const lb = JSON.parse(localStorage.getItem('LB') || '[]')
		let scoreid = localStorage.getItem('seq');
		if (scoreid === null) scoreid = '0';

		let name = prompt('이름을 입력하세요');
		if (name !== null && name.trim() !== '') {
			const entry = {
				id: scoreid,
				name: name.trim(),
				score: this.score
			};
			lb.push(entry);
			lb.sort((a, b) => b.score - a.score);
			if (lb.length > 10) lb.length = 10;
			localStorage.setItem('LB', JSON.stringify(lb));
			localStorage.setItem('seq', "" + (parseInt(scoreid) + 1));
		}

		// 순위 출력 (최신 순위 기준)
		const tooltip = document.getElementById('tooltip');
		let board = '';
		lb.forEach((e, idx) => {
			board += `${idx + 1}. ${e.name} — ${e.score}<br>`;
		});
		tooltip.innerHTML = board;
		tooltip.style.left = '50%';
		tooltip.style.top = '50%';
		tooltip.style.transform = 'translate(-50%, -50%)';
		tooltip.style.display = 'block';
	}
}

/* ---------------------------------------------------------
   3) Upgrade 씬 (변동은 거의 없음)
--------------------------------------------------------- */
/* ------------------------------------------------------------------
   Upgrade Scene  ―  랜덤 3종 표시
------------------------------------------------------------------*/
class Upgrade extends Phaser.Scene {
	constructor() { super('Upgrade'); }

	create() {
		const g = this.scene.get('Game');        // Game 씬 참조
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;

		/* ◆ 업그레이드 풀에서 3개 뽑기 (중복 없이) */
		const pool = Phaser.Utils.Array.Shuffle([...UPGRADE_POOL]);
		const shown = pool.slice(0, Math.min(3, pool.length));

		shown.forEach((opt, i) => {
			this.add.text(cx - 120, cy + i * 60, opt.txt, {
				fontSize: 24, fill: '#0f0',
				backgroundColor: '#222', padding: { x: 10, y: 5 }
			})
				.setInteractive({ useHandCursor: true })
				.on('pointerdown', () => {
					opt.act(g);          // 효과 적용
					this.scene.stop();   // 업그레이드 창 닫기
					g.scene.resume();    // 게임 재개
				});
		});
	}
}




/* ---------------------------------------------------------
   4) Phaser 실행
--------------------------------------------------------- */
new Phaser.Game({
	type: Phaser.AUTO,
	width: SETTINGS.game.W,
	height: SETTINGS.game.H,
	parent: 'game',
	physics: { default: 'arcade' },
	scene: [Game, Upgrade]
});
