/* =====================================================
   Rohit Kumar, academic site
   Theme, navigation, reveal, BibTeX, and the interactive
   eccentric-binary explainer.
   ===================================================== */

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Theme (two buttons: side panel and mobile bar) ---------- */
const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));
function syncThemeButtons() {
    const dark = root.getAttribute('data-theme') === 'dark';
    themeButtons.forEach(btn => {
        btn.querySelector('i').className = dark ? 'fas fa-sun' : 'fas fa-moon';
        btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
}
syncThemeButtons();
themeButtons.forEach(btn => btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
    syncThemeButtons();
}));

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById('mobileMenuBtn');
const menu = document.getElementById('mobileMenu');
function setMenu(open) {
    menu.classList.toggle('active', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.querySelector('i').className = open ? 'fas fa-xmark' : 'fas fa-bars';
}
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('active')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ---------- Scroll: progress bar, back-to-top, active side-nav item ---------- */
const progress = document.getElementById('progressBar');
const toTop = document.getElementById('backToTop');
const snavs = Array.from(document.querySelectorAll('.snav'));
const sections = Array.from(document.querySelectorAll('main section[id]'));
// Sub-sections that live under the "Background" item of the side nav
const navAlias = { certifications: 'education', skills: 'education', teaching: 'education', blog: 'education' };

let ticking = false;
function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.min(100, y / max * 100) : 0) + '%';
    toTop.classList.toggle('visible', y > 600);

    let current = 'home';
    for (const s of sections) if (y >= s.offsetTop - 160) current = s.id;
    const target = navAlias[current] || current;
    snavs.forEach(l => {
        const on = l.dataset.id === target;
        l.classList.toggle('active', on);
        if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current');
    });
    ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

/* ---------- Reveal on scroll (content stays visible if JS or IO is missing) ---------- */
const revealEls = document.querySelectorAll('.sec .col > *');
revealEls.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => io.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('in'));
}

/* ---------- Poster link: show only when the PDF exists ---------- */
const posterLink = document.getElementById('posterLink');
if (posterLink) {
    fetch(posterLink.getAttribute('href'), { method: 'HEAD' })
        .then(r => { if (r.ok) posterLink.hidden = false; })
        .catch(() => {});
}

/* ---------- BibTeX ---------- */
const citeBtn = document.getElementById('citeBtn');
const citeBox = document.getElementById('citeBox');
if (citeBtn && citeBox) {
    citeBtn.addEventListener('click', () => {
        const open = citeBox.hidden;
        citeBox.hidden = !open;
        citeBtn.setAttribute('aria-expanded', String(open));
    });
    const copyBtn = document.getElementById('copyCite');
    copyBtn.addEventListener('click', async () => {
        const text = document.getElementById('citeText').textContent;
        try { await navigator.clipboard.writeText(text); copyBtn.textContent = 'Copied'; }
        catch (e) { copyBtn.textContent = 'Select and copy manually'; }
        setTimeout(() => { copyBtn.textContent = 'Copy BibTeX'; }, 1800);
    });
}

document.getElementById('currentYear').textContent = new Date().getFullYear();

/* =====================================================
   Interactive explainer: eccentric binary + Roche lobe
   -----------------------------------------------------
   Units: semi-major axis a = 1.
   Orbit: Kepler's equation  M = E - e sin E.
   Separation: r = 1 - e cos E.
   Roche lobe (Eggleton 1983), at instantaneous separation r:
       R_L / r = 0.49 q^(2/3) / (0.6 q^(2/3) + ln(1 + q^(1/3)))
   with q = M_donor / M_accretor.
   ===================================================== */
(function () {
    const stage = document.getElementById('simCanvas');
    const chart = document.getElementById('chartCanvas');
    if (!stage || !chart) return;
    const sctx = stage.getContext('2d');
    const cctx = chart.getContext('2d');

    const $ = id => document.getElementById(id);
    const inE = $('inE'), inQ = $('inQ'), inR = $('inR'), inP = $('inP'), inS = $('inS');
    const outE = $('outE'), outQ = $('outQ'), outR = $('outR'), outP = $('outP'), outS = $('outS');
    const playBtn = $('simPlay'), resetBtn = $('simReset');
    const badge = $('simBadge'), status = $('simStatus');
    const roSep = $('roSep'), roRL = $('roRL'), roFrac = $('roFrac'), roRho = $('roRho');

    const TAU = Math.PI * 2;
    const PERIOD_SECONDS = 9;            // one orbit at 1x speed
    const DEFAULTS = { e: 0.5, q: 1, R: 0.25, s: 1, phase: 0 };

    let e = DEFAULTS.e, q = DEFAULTS.q, Rd = DEFAULTS.R, speed = DEFAULTS.s;
    let phase = 0;                       // orbital phase 0..1 (0 = periastron)
    let playing = false, visible = true, lastT = 0, raf = 0, lastState = null;

    /* ----- physics ----- */
    function solveKepler(M, ecc) {
        let E = ecc < 0.8 ? M : Math.PI;
        for (let i = 0; i < 25; i++) {
            const d = (E - ecc * Math.sin(E) - M) / (1 - ecc * Math.cos(E));
            E -= d;
            if (Math.abs(d) < 1e-10) break;
        }
        return E;
    }
    function rocheOverR(qd) {                  // Eggleton: R_L / separation
        const q23 = Math.pow(qd, 2 / 3);
        return 0.49 * q23 / (0.6 * q23 + Math.log(1 + Math.pow(qd, 1 / 3)));
    }
    function separation(ph) {                  // r/a at orbital phase ph
        const E = solveKepler(ph * TAU, e);
        return 1 - e * Math.cos(E);
    }
    function rlofFraction() {
        const k = rocheOverR(q), N = 720;
        let n = 0;
        for (let i = 0; i < N; i++) if (Rd >= k * separation((i + 0.5) / N)) n++;
        return n / N;
    }

    /* ----- canvas sizing ----- */
    function fit(cv, ctx) {
        const r = cv.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = Math.max(1, Math.round(r.width * dpr));
        cv.height = Math.max(1, Math.round(r.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { w: r.width, h: r.height };
    }
    let S = { w: 0, h: 0 }, C = { w: 0, h: 0 };
    function resize() { S = fit(stage, sctx); C = fit(chart, cctx); draw(performance.now()); }

    /* ----- background stars (fixed positions) ----- */
    const stars = Array.from({ length: 70 }, (_, i) => {
        const a = Math.sin(i * 12.9898) * 43758.5453, b = Math.sin(i * 78.233) * 12345.6789;
        return { x: a - Math.floor(a), y: b - Math.floor(b), r: 0.4 + ((i * 37) % 10) / 10, o: 0.25 + ((i * 53) % 10) / 16 };
    });

    /* ----- drawing: orbit view ----- */
    function drawStage(t) {
        const { w, h } = S;
        sctx.clearRect(0, 0, w, h);

        for (const s of stars) {
            sctx.fillStyle = 'rgba(255,255,255,' + s.o.toFixed(2) + ')';
            sctx.beginPath(); sctx.arc(s.x * w, s.y * h, s.r, 0, TAU); sctx.fill();
        }

        const b = Math.sqrt(1 - e * e);
        const pad = 0.12;
        const scale = Math.min(w * (1 - pad * 2) / 2.0, h * (1 - pad * 2 - 0.08) / (2 * b));
        const cx = w / 2 - e * scale;          // centre of mass sits at one focus
        const cy = h / 2 - 0.02 * h;

        const f1 = 1 / (1 + q);                // donor distance from CoM = f1 * separation
        const f2 = q / (1 + q);                // accretor distance from CoM = f2 * separation

        const E = solveKepler(phase * TAU, e);
        const rx = Math.cos(E) - e, ry = b * Math.sin(E);   // relative vector, accretor minus donor
        const r = 1 - e * Math.cos(E);

        const P = (kx, ky) => [cx + kx * scale, cy - ky * scale];
        const donor = P(-f1 * rx, -f1 * ry);
        const acc = P(f2 * rx, f2 * ry);

        function orbitPath(sign, f) {
            sctx.beginPath();
            for (let i = 0; i <= 160; i++) {
                const ee = i / 160 * TAU;
                const p = P(sign * f * (Math.cos(ee) - e), sign * f * b * Math.sin(ee));
                if (i === 0) sctx.moveTo(p[0], p[1]); else sctx.lineTo(p[0], p[1]);
            }
            sctx.stroke();
        }
        sctx.lineWidth = 1;
        sctx.strokeStyle = 'rgba(255,154,77,0.28)'; orbitPath(-1, f1);
        sctx.strokeStyle = 'rgba(158,196,255,0.28)'; orbitPath(1, f2);

        const com = P(0, 0);
        sctx.strokeStyle = 'rgba(255,255,255,0.35)';
        sctx.beginPath(); sctx.moveTo(com[0] - 4, com[1]); sctx.lineTo(com[0] + 4, com[1]);
        sctx.moveTo(com[0], com[1] - 4); sctx.lineTo(com[0], com[1] + 4); sctx.stroke();

        sctx.strokeStyle = 'rgba(255,255,255,0.18)';
        sctx.setLineDash([2, 4]);
        sctx.beginPath(); sctx.moveTo(donor[0], donor[1]); sctx.lineTo(acc[0], acc[1]); sctx.stroke();
        sctx.setLineDash([]);

        const RL = rocheOverR(q) * r;
        const active = Rd >= RL;
        const rlPx = RL * scale;
        const rdPx = Math.max(4, Rd * scale);

        sctx.strokeStyle = active ? '#f2b84b' : '#5fd4ee';
        sctx.lineWidth = 1.6;
        sctx.setLineDash([5, 5]);
        sctx.beginPath(); sctx.arc(donor[0], donor[1], rlPx, 0, TAU); sctx.stroke();
        sctx.setLineDash([]);

        const g = sctx.createRadialGradient(donor[0] - rdPx * 0.3, donor[1] - rdPx * 0.3, rdPx * 0.1, donor[0], donor[1], rdPx);
        g.addColorStop(0, '#ffd9a8'); g.addColorStop(1, active ? '#ff7a2f' : '#e8782f');
        sctx.fillStyle = g;
        sctx.beginPath(); sctx.arc(donor[0], donor[1], rdPx, 0, TAU); sctx.fill();

        if (active) {
            const dx = acc[0] - donor[0], dy = acc[1] - donor[1], len = Math.hypot(dx, dy) || 1;
            const ux = dx / len, uy = dy / len;
            const sx = donor[0] + ux * rdPx, sy = donor[1] + uy * rdPx;
            const ex = acc[0] - ux * 9, ey = acc[1] - uy * 9;
            sctx.strokeStyle = 'rgba(242,184,75,0.9)';
            sctx.lineWidth = 2;
            sctx.setLineDash([6, 5]);
            sctx.lineDashOffset = reduceMotion ? 0 : -(t / 40) % 11;
            sctx.beginPath(); sctx.moveTo(sx, sy); sctx.lineTo(ex, ey); sctx.stroke();
            sctx.setLineDash([]); sctx.lineDashOffset = 0;
        }

        const ag = sctx.createRadialGradient(acc[0] - 2, acc[1] - 2, 1, acc[0], acc[1], 7);
        ag.addColorStop(0, '#ffffff'); ag.addColorStop(1, '#7fb0ff');
        sctx.fillStyle = ag;
        sctx.beginPath(); sctx.arc(acc[0], acc[1], 6, 0, TAU); sctx.fill();

        const peri = P(f2 * (1 - e), 0);
        sctx.fillStyle = 'rgba(255,255,255,0.5)';
        sctx.font = '11px "IBM Plex Mono", monospace';
        sctx.fillText('periastron', peri[0] + 8, peri[1] + 4);

        return { r, RL, active };
    }

    /* ----- drawing: Roche lobe vs. donor radius over one orbit ----- */
    function drawChart(state) {
        const { w, h } = C;
        cctx.clearRect(0, 0, w, h);
        const L = 42, R = 12, T = 12, B = 24;
        const pw = w - L - R, ph = h - T - B;

        const k = rocheOverR(q);
        const rMax = 1 + e;
        const yMax = Math.max(Rd, k * rMax) * 1.12;
        const X = p => L + p * pw;
        const Y = v => T + ph - v / yMax * ph;

        const N = 360;
        cctx.fillStyle = 'rgba(242,184,75,0.16)';
        let start = -1;
        for (let i = 0; i <= N; i++) {
            const p = i / N;
            const on = Rd >= k * separation(p);
            if (on && start < 0) start = p;
            if ((!on || i === N) && start >= 0) {
                cctx.fillRect(X(start), T, X(on ? p : p - 1 / N) - X(start), ph);
                start = -1;
            }
        }

        cctx.strokeStyle = '#26304a'; cctx.lineWidth = 1;
        cctx.beginPath(); cctx.moveTo(L, T); cctx.lineTo(L, T + ph); cctx.lineTo(L + pw, T + ph); cctx.stroke();
        cctx.fillStyle = '#94a0bd';
        cctx.font = '10.5px "IBM Plex Mono", monospace';
        cctx.textAlign = 'center';
        [0, 0.25, 0.5, 0.75, 1].forEach(p => cctx.fillText(p.toFixed(2).replace(/0+$/, '').replace(/\.$/, '') || '0', X(p), h - 8));
        cctx.textAlign = 'right';
        cctx.fillText('R / a', L - 6, T + 10);
        cctx.fillText('0', L - 6, T + ph + 3);

        cctx.strokeStyle = '#ff9a4d'; cctx.lineWidth = 1.8;
        cctx.beginPath(); cctx.moveTo(L, Y(Rd)); cctx.lineTo(L + pw, Y(Rd)); cctx.stroke();
        cctx.fillStyle = '#ffb676'; cctx.textAlign = 'left';
        cctx.fillText('R donor', L + 6, Y(Rd) - 5);

        cctx.strokeStyle = '#5fd4ee'; cctx.lineWidth = 1.8;
        cctx.beginPath();
        for (let i = 0; i <= 240; i++) {
            const p = i / 240, v = k * separation(p);
            if (i === 0) cctx.moveTo(X(p), Y(v)); else cctx.lineTo(X(p), Y(v));
        }
        cctx.stroke();
        cctx.fillStyle = '#7fe0f2'; cctx.textAlign = 'right';
        cctx.fillText('Roche lobe', L + pw - 4, T + 12);

        cctx.strokeStyle = 'rgba(255,255,255,0.7)'; cctx.lineWidth = 1;
        cctx.beginPath(); cctx.moveTo(X(phase), T); cctx.lineTo(X(phase), T + ph); cctx.stroke();
        cctx.fillStyle = '#fff';
        cctx.beginPath(); cctx.arc(X(phase), Y(state.RL), 3.5, 0, TAU); cctx.fill();
    }

    /* ----- readouts and status ----- */
    function updateReadouts(state) {
        outE.textContent = e.toFixed(2);
        outQ.textContent = q.toFixed(2);
        outR.textContent = Rd.toFixed(2);
        outP.textContent = phase.toFixed(2);
        outS.textContent = speed.toFixed(2).replace(/0$/, '').replace(/\.$/, '.0') + '×';
        inP.value = phase;

        roSep.textContent = state.r.toFixed(2) + ' a';
        roRL.textContent = state.RL.toFixed(3) + ' a';
        roFrac.textContent = Math.round(rlofFraction() * 100) + '% of orbit';
        const ratio = Math.pow((1 + e) / (1 - e), 2);
        roRho.textContent = '×' + (ratio >= 100 ? ratio.toFixed(0) : ratio.toFixed(1));

        badge.textContent = state.active ? 'Roche-lobe overflow' : 'Detached';
        badge.classList.toggle('on', state.active);
        if (lastState === null || lastState !== state.active) {
            status.textContent = state.active ? 'Donor is filling its Roche lobe: mass transfer on.' : 'Donor is inside its Roche lobe: detached.';
            lastState = state.active;
        }
    }

    function draw(t) {
        if (!S.w) return;
        const state = drawStage(t || 0);
        drawChart(state);
        updateReadouts(state);
    }

    /* ----- animation loop ----- */
    function frame(t) {
        if (!playing || !visible) { raf = 0; return; }
        if (!lastT) lastT = t;
        const dt = Math.min(0.05, (t - lastT) / 1000);
        lastT = t;
        phase = (phase + dt * speed / PERIOD_SECONDS) % 1;
        draw(t);
        raf = requestAnimationFrame(frame);
    }
    function setPlaying(on) {
        playing = on;
        playBtn.setAttribute('aria-pressed', String(on));
        playBtn.querySelector('i').className = on ? 'fas fa-pause' : 'fas fa-play';
        playBtn.querySelector('span').textContent = on ? 'Pause' : 'Play';
        lastT = 0;
        if (on && !raf) raf = requestAnimationFrame(frame);
    }

    /* ----- controls ----- */
    function bind(input, fn) {
        input.addEventListener('input', () => { fn(parseFloat(input.value)); draw(performance.now()); });
    }
    bind(inE, v => { e = v; });
    bind(inQ, v => { q = v; });
    bind(inR, v => { Rd = v; });
    bind(inS, v => { speed = v; });
    inP.addEventListener('input', () => { phase = parseFloat(inP.value) % 1; if (playing) setPlaying(false); draw(performance.now()); });

    playBtn.addEventListener('click', () => setPlaying(!playing));
    resetBtn.addEventListener('click', () => {
        e = DEFAULTS.e; q = DEFAULTS.q; Rd = DEFAULTS.R; speed = DEFAULTS.s; phase = DEFAULTS.phase;
        inE.value = e; inQ.value = q; inR.value = Rd; inS.value = speed; inP.value = phase;
        lastState = null;
        draw(performance.now());
    });

    // Only animate while on screen and the tab is visible
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(en => {
            visible = en[0].isIntersecting;
            if (visible && playing && !raf) { lastT = 0; raf = requestAnimationFrame(frame); }
        }, { threshold: 0.1 }).observe(stage);
    }
    document.addEventListener('visibilitychange', () => {
        visible = !document.hidden;
        if (visible && playing && !raf) { lastT = 0; raf = requestAnimationFrame(frame); }
    });

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage.parentElement);
    window.addEventListener('resize', resize);
    resize();

    // Respect reduced-motion: start paused. Otherwise start playing.
    if (!reduceMotion) setPlaying(true);
})();
