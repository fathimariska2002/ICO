/* ============================================================
   ICO — ANIMATED GLOBE / PARTICLE CANVAS
   ============================================================ */

(function () {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let W, H, cx, cy, radius;
  let animId;

  /* ── RESIZE ── */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cx = W / 2;
    cy = H / 2;
    radius = Math.min(W, H) * 0.38;
  }
  window.addEventListener('resize', resize);
  resize();

  /* ── GLOBE LINES ── */
  let angle = 0;

  function drawGlobe() {
    ctx.clearRect(0, 0, W, H);

    /* Outer glow */
    const grd = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 1.1);
    grd.addColorStop(0,   'rgba(200,168,75,0.06)');
    grd.addColorStop(0.7, 'rgba(26,50,96,0.12)');
    grd.addColorStop(1,   'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.1, 0, Math.PI * 2);
    ctx.fill();

    /* Globe circle */
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200,168,75,0.18)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    /* Latitude lines */
    const latLines = 8;
    for (let i = 1; i < latLines; i++) {
      const lat   = (i / latLines) * Math.PI - Math.PI / 2;
      const r     = Math.cos(lat) * radius;
      const yOff  = Math.sin(lat) * radius;
      ctx.beginPath();
      ctx.ellipse(cx, cy + yOff, r, r * 0.28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200,168,75,0.1)';
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    }

    /* Longitude lines (rotating) */
    const lonLines = 10;
    for (let i = 0; i < lonLines; i++) {
      const lon = (i / lonLines) * Math.PI + angle;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.abs(Math.cos(lon)) * radius, radius, lon, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200,168,75,${0.06 + 0.06 * Math.abs(Math.cos(lon))})`;
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    }

    /* Dots on globe surface */
    const dotCount = 60;
    for (let i = 0; i < dotCount; i++) {
      const theta = (i / dotCount) * Math.PI * 2 + angle * 0.5;
      const phi   = Math.acos(1 - 2 * ((i * 0.618033) % 1));
      const x     = cx + radius * Math.sin(phi) * Math.cos(theta);
      const y     = cy + radius * Math.cos(phi);
      const depth = Math.sin(phi) * Math.cos(theta);
      if (depth > -0.1) {
        const alpha = 0.15 + 0.55 * ((depth + 1) / 2);
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,168,75,${alpha})`;
        ctx.fill();
      }
    }

    /* Connection arcs */
    const nodes = [
      { lat: 0.8,  lon: 0.2  },
      { lat: -0.3, lon: 1.1  },
      { lat: 0.5,  lon: 2.5  },
      { lat: -0.6, lon: 3.8  },
      { lat: 0.2,  lon: 4.5  },
    ];
    nodes.forEach((n, i) => {
      const lon  = n.lon + angle;
      const x    = cx + radius * Math.cos(n.lat) * Math.cos(lon);
      const y    = cy + radius * Math.sin(n.lat);
      const depth = Math.cos(n.lat) * Math.cos(lon);
      if (depth > 0) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,168,75,${0.4 + 0.4 * depth})`;
        ctx.fill();
        // connect to next
        const next = nodes[(i + 1) % nodes.length];
        const nlon = next.lon + angle;
        const nx   = cx + radius * Math.cos(next.lat) * Math.cos(nlon);
        const ny   = cy + radius * Math.sin(next.lat);
        const ndepth = Math.cos(next.lat) * Math.cos(nlon);
        if (ndepth > 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.quadraticCurveTo(cx, cy - radius * 0.3, nx, ny);
          ctx.strokeStyle = `rgba(200,168,75,${0.12 * depth})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }
    });
  }

  /* ── PARTICLES ── */
  const particles = Array.from({ length: 55 }, () => ({
    x:     Math.random() * 1,
    y:     Math.random() * 1,
    size:  Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.0003 + 0.0001,
    alpha: Math.random() * 0.4 + 0.1,
    drift: (Math.random() - 0.5) * 0.0002,
  }));

  function drawParticles() {
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < 0) { p.y = 1; p.x = Math.random(); }
      if (p.x < 0 || p.x > 1) p.drift *= -1;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,168,75,${p.alpha})`;
      ctx.fill();
    });
  }

  /* ── LOOP ── */
  function loop() {
    angle += 0.003;
    drawGlobe();
    drawParticles();
    animId = requestAnimationFrame(loop);
  }
  loop();

  /* ── PAUSE when not visible ── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      loop();
    }
  });

})();
