(function () {
  function init() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const STAR_COUNT = 90 + Math.floor(Math.random() * 31);
    const stars = [];
    const pointer = { tx: 0, ty: 0, x: 0, y: 0 };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastTime = 0;

    const white = { r: 255, g: 255, b: 255 };
    const purple = { r: 129, g: 74, b: 200 };

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    function pickBrightness() {
      const roll = Math.random();
      if (roll < 0.15) return 0;
      if (roll < 0.4) return 1;
      return 2;
    }

    function pickColor() {
      return Math.random() < 0.68 ? white : purple;
    }

    function createStar(index) {
      const layerRoll = index / STAR_COUNT;
      const layer = layerRoll < 0.4 ? 0 : layerRoll < 0.75 ? 1 : 2;
      const brightness = pickBrightness();
      const color = pickColor();
      const isPurple = color === purple;

      const size =
        brightness === 2
          ? rand(2, 3.5)
          : brightness === 1
            ? rand(1.5, 2.8)
            : rand(1, 2.2);

      const opacityBands = [
        { min: 0.35, max: 0.6 },
        { min: 0.55, max: 0.82 },
        { min: 0.75, max: 1 },
      ];
      const band = opacityBands[brightness];
      const baseOpacity = rand(band.min, band.max) * (isPurple ? 0.85 : 1);

      const direction = layer === 0 ? rand(2.2, 2.8) : rand(0, Math.PI * 2);
      const speedBase =
        layer === 0 ? rand(0.012, 0.03) : layer === 1 ? rand(0.03, 0.06) : rand(0.045, 0.09);

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        baseOpacity,
        opacityRange: rand(0.1, 0.25) * (brightness === 2 ? 1.2 : 1),
        delay: Math.random() * 5000,
        duration: rand(2000, 5000),
        phase: Math.random() * Math.PI * 2,
        layer,
        brightness,
        color,
        isPurple,
        vx: Math.cos(direction) * speedBase,
        vy: Math.sin(direction) * speedBase,
        wanderPhase: Math.random() * Math.PI * 2,
        wanderRate: rand(0.25, 0.9),
        driftAmp:
          layer === 0 ? rand(0.008, 0.02) : layer === 1 ? rand(0.018, 0.045) : rand(0.03, 0.06),
        parallax: layer === 2 ? rand(0.55, 1) : layer === 1 ? rand(0.15, 0.32) : rand(0.05, 0.12),
        twinkleSpeed: rand(0.85, 1.65),
        glow:
          brightness === 2 ? rand(3, 5.5) : brightness === 1 ? rand(2, 3.5) : rand(1.2, 2),
        directionTimer: rand(3, 9),
        directionElapsed: 0,
      };
    }

    function rebuildStars() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i += 1) {
        stars.push(createStar(i));
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function easeInOutSine(t) {
      return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    function twinkleOpacity(star, time) {
      const elapsed = Math.max(0, time - star.delay);
      const cycle = (elapsed % star.duration) / star.duration;
      const eased = easeInOutSine(cycle);
      const wave = Math.sin(cycle * Math.PI * 2 * star.twinkleSpeed + star.phase);
      const oscillation = wave * star.opacityRange * (0.45 + eased * 0.55);
      return Math.max(0.2, Math.min(1, star.baseOpacity + oscillation));
    }

    function wrapStar(star) {
      const pad = 30;
      if (star.x < -pad) star.x = width + pad;
      if (star.x > width + pad) star.x = -pad;
      if (star.y < -pad) star.y = height + pad;
      if (star.y > height + pad) star.y = -pad;
    }

    function maxSpeedForLayer(layer) {
      if (layer === 0) return 0.04;
      if (layer === 1) return 0.08;
      return 0.12;
    }

    function updateStarMotion(star, dt, time, motionScale) {
      if (!motionScale) return;

      star.directionElapsed += dt * 0.001;
      if (star.directionElapsed >= star.directionTimer) {
        star.directionElapsed = 0;
        star.directionTimer = rand(3, 9);
        const turn = rand(-0.6, 0.6);
        const cos = Math.cos(turn);
        const sin = Math.sin(turn);
        const nx = star.vx * cos - star.vy * sin;
        const ny = star.vx * sin + star.vy * cos;
        star.vx = nx;
        star.vy = ny;
      }

      const wander = star.wanderPhase + time * 0.00012 * star.wanderRate;
      star.vx += Math.cos(wander + star.layer) * star.driftAmp * 0.0008 * dt;
      star.vy += Math.sin(wander * 1.37 + star.layer * 2.1) * star.driftAmp * 0.0008 * dt;

      const speed = Math.hypot(star.vx, star.vy) || 0.0001;
      const maxSpeed = maxSpeedForLayer(star.layer);
      if (speed > maxSpeed) {
        star.vx = (star.vx / speed) * maxSpeed;
        star.vy = (star.vy / speed) * maxSpeed;
      }

      const driftScale = star.layer === 0 ? 0.35 : star.layer === 1 ? 0.65 : 1;
      star.x += star.vx * dt * driftScale;
      star.y += star.vy * dt * driftScale;
      wrapStar(star);
    }

    function drawStar(star, offsetX, offsetY, opacity) {
      const x = star.x + offsetX;
      const y = star.y + offsetY;
      const radius = Math.max(0.6, star.size / 2);
      const { r, g, b } = star.color;
      const colorAlpha = star.isPurple ? 0.65 : 0.85;
      const alpha = opacity * colorAlpha;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.glow);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      gradient.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${alpha * 0.45})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, star.glow, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, alpha * 1.15)})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate(time) {
      if (!lastTime) lastTime = time;
      const dt = Math.min(32, time - lastTime);
      lastTime = time;

      pointer.x += (pointer.tx - pointer.x) * 0.055;
      pointer.y += (pointer.ty - pointer.y) * 0.055;

      const motionScale = reducedMotion.matches ? 0 : 1;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i += 1) {
        updateStarMotion(stars[i], dt, time, motionScale);
      }

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        const opacity = twinkleOpacity(star, time);
        const offsetX = pointer.x * star.parallax;
        const offsetY = pointer.y * star.parallax;
        drawStar(star, offsetX, offsetY, opacity);
      }

      window.requestAnimationFrame(animate);
    }

    function setPointer(clientX, clientY) {
      const nx = clientX / Math.max(1, width) - 0.5;
      const ny = clientY / Math.max(1, height) - 0.5;
      pointer.tx = Math.max(-18, Math.min(18, nx * 30));
      pointer.ty = Math.max(-18, Math.min(18, ny * 30));
    }

    window.addEventListener('resize', () => {
      resize();
      rebuildStars();
    }, { passive: true });

    window.addEventListener('pointermove', (event) => setPointer(event.clientX, event.clientY), {
      passive: true,
    });
    window.addEventListener('pointerleave', () => {
      pointer.tx = 0;
      pointer.ty = 0;
    }, { passive: true });

    resize();
    rebuildStars();
    window.requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
