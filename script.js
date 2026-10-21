/* =====================================================
   Rohit Kumar, academic site
   Theme, navigation, reveal, BibTeX, and the interactive
   eccentric-binary explainer (wind accretion vs. RLOF).
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
   Interactive explainer: wind accretion vs. Roche-lobe overflow
   -----------------------------------------------------
   Units: semi-major axis a = 1, total mass = 1, G = 1,
   so the mean motion n = 1 and one orbit lasts 2*pi.
   Orbit: Kepler's equation  M = E - e sin E.
   Separation: r = 1 - e cos E.
   Roche lobe (Eggleton 1983), at instantaneous separation r:
       R_L / r = 0.49 q^(2/3) / (0.6 q^(2/3) + ln(1 + q^(1/3)))
   with q = M_donor / M_accretor.

   Gas is a cloud of test particles moving in the gravity of
   both stars (a toy model, not hydrodynamics).
     Wind mode: particles leave the donor isotropically at speed v_w.
     RLOF mode: particles leave through L1 only while the donor
                fills its Roche lobe.
   A weak drag close to the accretor stands in for viscosity,
   so bound gas can settle into a short-lived, disk-like swirl.
   ===================================================== */
(function () {
    const stage = document.getElementById('simCanvas');
    const chart = document.getElementById('chartCanvas');
    if (!stage || !chart) return;
    const sctx = stage.getContext('2d');
    const cctx = chart.getContext('2d');

    const $ = id => document.getElementById(id);
    const inE = $('inE'), inQ = $('inQ'), inR = $('inR'), inP = $('inP'), inS = $('inS'), inW = $('inW');
    const outE = $('outE'), outQ = $('outQ'), outR = $('outR'), outP = $('outP'), outS = $('outS'), outW = $('outW');
    const lblW = $('lblW');
    const playBtn = $('simPlay'), resetBtn = $('simReset');
    const modeWind = $('modeWind'), modeRlof = $('modeRlof');
    const badge = $('simBadge'), status = $('simStatus');
    const readout = $('simReadout');
    const roSep = $('roSep'), roRL = $('roRL'), roFrac = $('roFrac'), roRho = $('roRho');
    const roBHL = $('roBHL'), roBound = $('roBound'), roAcc = $('roAcc');

    const TAU = Math.PI * 2;
    const PERIOD_SECONDS = 9;            // one orbit at 1x speed
    const DEFAULTS = { e: 0.5, q: 1, R: 0.25, s: 1, w: 2.5, phase: 0 };

    let e = DEFAULTS.e, q = DEFAULTS.q, Rd = DEFAULTS.R, speed = DEFAULTS.s, vw = DEFAULTS.w;
    let mode = 'wind';                   // 'wind' | 'rlof'
    let phase = 0;                       // orbital phase 0..1 (0 = periastron)
    let playing = false, visible = true, lastT = 0, raf = 0, lastKey = null;

    /* ----- gas particle settings ----- */
    const MAXP = 2200;                   // particle cap
    const SUBSTEP = 0.004;               // max integration step (orbit units)
    const EPS2 = 2.5e-5;                 // gravitational softening squared
    const ABSORB2 = 0.022 * 0.022;       // accretor surface: gas is accreted inside this
    const DISK_R2 = 0.15 * 0.15;         // "near accretor" radius for drag and disk count
    const DRAG = 0.2;                    // weak drag near the accretor (stands in for viscosity)
    const OUT2 = 2.0 * 2.0;              // gas beyond this distance from the CoM is dropped
    const WIND_RATE = 600;               // particles per unit time (wind)
    const RLOF_MIN = 120, RLOF_MAX = 420; // particles per unit time (RLOF, scales with overflow depth)

    const gx = new Float32Array(MAXP), gy = new Float32Array(MAXP);
    const gvx = new Float32Array(MAXP), gvy = new Float32Array(MAXP);
    const gk = new Uint8Array(MAXP);     // 0 = wind, 1 = RLOF stream
    const gc = new Uint8Array(MAXP);     // draw category: 0 wind, 1 RLOF, 2 bound to accretor
    let gn = 0, accreted = 0, emitAcc = 0, boundN = 0;

    /* ----- orbit physics ----- */
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

    // Positions and velocities of both stars in the centre-of-mass frame (y up)
    function starState(ph) {
        const w = ph - Math.floor(ph);
        const E = solveKepler(w * TAU, e);
        const b = Math.sqrt(1 - e * e);
        const rx = Math.cos(E) - e, ry = b * Math.sin(E);       // accretor minus donor
        const r = 1 - e * Math.cos(E);
        const vx = -Math.sin(E) / r, vy = b * Math.cos(E) / r;  // d(rel)/dt, since dE/dt = 1/r
        const f1 = 1 / (1 + q), f2 = q / (1 + q);               // f1 = accretor mass, f2 = donor mass
        return {
            r, rx, ry, vx, vy, f1, f2,
            dx: -f1 * rx, dy: -f1 * ry, ax: f2 * rx, ay: f2 * ry,
            dvx: -f1 * vx, dvy: -f1 * vy, avx: f2 * vx, avy: f2 * vy
        };
    }
    // Bondi-Hoyle accretion radius: 2 G M_a / w^2, w = wind speed relative to the accretor
    function bhlRadius(s) {
        const ux = s.rx / s.r, uy = s.ry / s.r;
        const wx = vw * ux - s.vx, wy = vw * uy - s.vy;
        return 2 * s.f1 / Math.max(wx * wx + wy * wy, 0.05);
    }

    /* ----- gas: emission and integration ----- */
    function clearGas() { gn = 0; accreted = 0; emitAcc = 0; boundN = 0; }

    function emitGas(s, h) {
        if (mode === 'wind') {
            emitAcc += WIND_RATE * h;
            const rs = Rd * 1.04;
            while (emitAcc >= 1) {
                emitAcc -= 1;
                if (gn >= MAXP) { emitAcc = 0; break; }
                const th = Math.random() * TAU, ux = Math.cos(th), uy = Math.sin(th);
                const i = gn++;
                gx[i] = s.dx + rs * ux; gy[i] = s.dy + rs * uy;
                gvx[i] = s.dvx + vw * ux; gvy[i] = s.dvy + vw * uy;
                gk[i] = 0;
            }
            return;
        }
        // RLOF: gas flows through L1 only while the donor fills its Roche lobe
        const RL = rocheOverR(q) * s.r;
        if (Rd < RL) { emitAcc = 0; return; }
        const depth = Math.min(1, (Rd / RL - 1) * 4);
        emitAcc += (RLOF_MIN + (RLOF_MAX - RLOF_MIN) * depth) * h;
        const ux = s.rx / s.r, uy = s.ry / s.r;                  // unit vector donor -> accretor
        const fl1 = Math.min(0.8, Math.max(0.2, 0.5 + 0.227 * Math.log10(q)));
        const d = Math.min(0.9 * s.r, Math.max(fl1 * s.r, Rd * 1.02));
        const omega = (s.rx * s.vy - s.ry * s.vx) / (s.r * s.r); // instantaneous orbital angular velocity
        while (emitAcc >= 1) {
            emitAcc -= 1;
            if (gn >= MAXP) { emitAcc = 0; break; }
            const jp = (Math.random() - 0.5) * 0.02;
            const px = s.dx + d * ux - uy * jp, py = s.dy + d * uy + ux * jp;
            const push = 0.3 + 0.1 * Math.random(), jv = (Math.random() - 0.5) * 0.1;
            const i = gn++;
            gx[i] = px; gy[i] = py;
            gvx[i] = s.dvx - omega * (py - s.dy) + push * ux - uy * jv;
            gvy[i] = s.dvy + omega * (px - s.dx) + push * uy + ux * jv;
            gk[i] = 1;
        }
    }

    // Advance the gas (and its emission) while the orbit moves from ph0 by dph (in orbital phase)
    function stepGas(ph0, dph) {
        if (dph <= 0) return;
        const n = Math.max(1, Math.ceil(dph * TAU / SUBSTEP));
        const h = dph * TAU / n;
        const rd2 = Rd * Rd;
        for (let k = 1; k <= n; k++) {
            const s = starState(ph0 + dph * k / n);
            emitGas(s, h);
            const GMd = s.f2, GMa = s.f1;
            for (let i = 0; i < gn; i++) {
                let x = gx[i], y = gy[i], vx = gvx[i], vy = gvy[i];
                const dxD = x - s.dx, dyD = y - s.dy, rD2 = dxD * dxD + dyD * dyD + EPS2;
                const dxA = x - s.ax, dyA = y - s.ay, rA2 = dxA * dxA + dyA * dyA + EPS2;
                const iD = GMd / (rD2 * Math.sqrt(rD2)), iA = GMa / (rA2 * Math.sqrt(rA2));
                vx += (-dxD * iD - dxA * iA) * h;
                vy += (-dyD * iD - dyA * iA) * h;
                if (rA2 < DISK_R2) {
                    const f = 1 - DRAG * h;
                    vx = s.avx + (vx - s.avx) * f;
                    vy = s.avy + (vy - s.avy) * f;
                }
                x += vx * h; y += vy * h;

                const ax = x - s.ax, ay = y - s.ay, ex = x - s.dx, ey = y - s.dy;
                let dead = false;
                if (ax * ax + ay * ay < ABSORB2) { accreted++; dead = true; }
                else if (ex * ex + ey * ey < rd2 || x * x + y * y > OUT2) dead = true;

                if (dead) {                       // swap-remove
                    gn--;
                    gx[i] = gx[gn]; gy[i] = gy[gn]; gvx[i] = gvx[gn]; gvy[i] = gvy[gn]; gk[i] = gk[gn];
                    i--;
                    continue;
                }
                gx[i] = x; gy[i] = y; gvx[i] = vx; gvy[i] = vy;
            }
        }
    }
    // Rebuild a snapshot of the gas by running the last ~0.45 orbit up to the current phase
    function warmUp() {
        clearGas();
        stepGas(phase - 0.45, 0.45);
        accreted = 0;
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

    /* ----- drawing: gas particles ----- */
    const GAS_COLORS = ['rgba(255,166,96,0.8)', 'rgba(242,184,75,0.95)', 'rgba(150,225,255,0.98)'];
    function drawGas(s, cx, cy, scale) {
        let nb = 0;
        for (let i = 0; i < gn; i++) {
            const dx = gx[i] - s.ax, dy = gy[i] - s.ay, r2 = dx * dx + dy * dy;
            let c = gk[i];
            if (r2 < DISK_R2) {                    // bound to the accretor and close by: disk-like gas
                const dvx = gvx[i] - s.avx, dvy = gvy[i] - s.avy;
                if (0.5 * (dvx * dvx + dvy * dvy) - s.f1 / Math.sqrt(r2 + EPS2) < 0) c = 2;
            }
            gc[i] = c;
            if (c === 2) nb++;
        }
        boundN = nb;
        for (let c = 0; c < 3; c++) {
            sctx.fillStyle = GAS_COLORS[c];
            for (let i = 0; i < gn; i++) {
                if (gc[i] !== c) continue;
                sctx.fillRect(cx + gx[i] * scale - 0.9, cy - gy[i] * scale - 0.9, 1.8, 1.8);
            }
        }
    }

    /* ----- drawing: orbit view ----- */
    function drawStage() {
        const { w, h } = S;
        sctx.clearRect(0, 0, w, h);

        for (const st of stars) {
            sctx.fillStyle = 'rgba(255,255,255,' + st.o.toFixed(2) + ')';
            sctx.beginPath(); sctx.arc(st.x * w, st.y * h, st.r, 0, TAU); sctx.fill();
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

        sctx.strokeStyle = 'rgba(255,255,255,0.14)';
        sctx.setLineDash([2, 4]);
        sctx.beginPath(); sctx.moveTo(donor[0], donor[1]); sctx.lineTo(acc[0], acc[1]); sctx.stroke();
        sctx.setLineDash([]);

        const RL = rocheOverR(q) * r;
        const active = mode === 'rlof' && Rd >= RL;
        const rlPx = RL * scale;
        const rdPx = Math.max(4, Rd * scale);

        sctx.strokeStyle = active ? '#f2b84b' : '#5fd4ee';
        sctx.lineWidth = 1.6;
        sctx.setLineDash([5, 5]);
        sctx.beginPath(); sctx.arc(donor[0], donor[1], rlPx, 0, TAU); sctx.stroke();
        sctx.setLineDash([]);

        // gas goes under the stars
        const s = starState(phase);
        drawGas(s, cx, cy, scale);

        const g = sctx.createRadialGradient(donor[0] - rdPx * 0.3, donor[1] - rdPx * 0.3, rdPx * 0.1, donor[0], donor[1], rdPx);
        g.addColorStop(0, '#ffd9a8'); g.addColorStop(1, active ? '#ff7a2f' : '#e8782f');
        sctx.fillStyle = g;
        sctx.beginPath(); sctx.arc(donor[0], donor[1], rdPx, 0, TAU); sctx.fill();

        const ag = sctx.createRadialGradient(acc[0] - 2, acc[1] - 2, 1, acc[0], acc[1], 7);
        ag.addColorStop(0, '#ffffff'); ag.addColorStop(1, '#7fb0ff');
        sctx.fillStyle = ag;
        sctx.beginPath(); sctx.arc(acc[0], acc[1], 6, 0, TAU); sctx.fill();

        const bhl = bhlRadius(s);
        if (mode === 'wind') {                 // Bondi-Hoyle accretion radius around the accretor
            const rb = Math.min(bhl, 0.45) * scale;
            sctx.strokeStyle = 'rgba(158,196,255,0.75)';
            sctx.lineWidth = 1.2;
            sctx.setLineDash([3, 4]);
            sctx.beginPath(); sctx.arc(acc[0], acc[1], rb, 0, TAU); sctx.stroke();
            sctx.setLineDash([]);
            sctx.fillStyle = 'rgba(158,196,255,0.8)';
            sctx.font = '10.5px "IBM Plex Mono", monospace';
            sctx.textAlign = 'left';
            sctx.fillText('R_BHL', acc[0] + rb * 0.72 + 4, acc[1] - rb * 0.72 - 3);
        }

        const peri = P(f2 * (1 - e), 0);
        sctx.fillStyle = 'rgba(255,255,255,0.5)';
        sctx.font = '11px "IBM Plex Mono", monospace';
        sctx.textAlign = 'left';
        sctx.fillText('periastron', peri[0] + 8, peri[1] + 4);

        return { r, RL, active, bhl };
    }

    /* ----- drawing: bottom chart (Roche lobe in RLOF mode, wind density in wind mode) ----- */
    function drawChart(state) {
        const { w, h } = C;
        cctx.clearRect(0, 0, w, h);
        const L = 42, R = 12, T = 12, B = 24;
        const pw = w - L - R, ph = h - T - B;
        const wind = mode === 'wind';

        const k = rocheOverR(q);
        const yMax = wind ? 1 / ((1 - e) * (1 - e)) * 1.12 : Math.max(Rd, k * (1 + e)) * 1.12;
        const X = p => L + p * pw;
        const Y = v => T + ph - v / yMax * ph;

        if (!wind) {
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
        }

        cctx.strokeStyle = '#26304a'; cctx.lineWidth = 1;
        cctx.beginPath(); cctx.moveTo(L, T); cctx.lineTo(L, T + ph); cctx.lineTo(L + pw, T + ph); cctx.stroke();
        cctx.fillStyle = '#94a0bd';
        cctx.font = '10.5px "IBM Plex Mono", monospace';
        cctx.textAlign = 'center';
        [0, 0.25, 0.5, 0.75, 1].forEach(p => cctx.fillText(p.toFixed(2).replace(/0+$/, '').replace(/\.$/, '') || '0', X(p), h - 8));
        cctx.textAlign = 'right';
        cctx.fillText(wind ? '\u03C1' : 'R / a', L - 6, T + 10);
        cctx.fillText('0', L - 6, T + ph + 3);

        if (wind) {
            cctx.strokeStyle = '#ff9a4d'; cctx.lineWidth = 1.8;
            cctx.beginPath();
            for (let i = 0; i <= 240; i++) {
                const p = i / 240, sep = separation(p), v = 1 / (sep * sep);
                if (i === 0) cctx.moveTo(X(p), Y(v)); else cctx.lineTo(X(p), Y(v));
            }
            cctx.stroke();
            cctx.fillStyle = '#ffb676'; cctx.textAlign = 'right';
            cctx.fillText('wind density at the accretor, \u03C1 \u221D r\u207B\u00B2', L + pw - 4, T + 12);
        } else {
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
        }

        const mark = wind ? 1 / (state.r * state.r) : state.RL;
        cctx.strokeStyle = 'rgba(255,255,255,0.7)'; cctx.lineWidth = 1;
        cctx.beginPath(); cctx.moveTo(X(phase), T); cctx.lineTo(X(phase), T + ph); cctx.stroke();
        cctx.fillStyle = '#fff';
        cctx.beginPath(); cctx.arc(X(phase), Y(mark), 3.5, 0, TAU); cctx.fill();
    }

    /* ----- readouts and status ----- */
    function updateReadouts(state) {
        outE.textContent = e.toFixed(2);
        outQ.textContent = q.toFixed(2);
        outR.textContent = Rd.toFixed(2);
        outP.textContent = phase.toFixed(2);
        outW.textContent = vw.toFixed(1);
        outS.textContent = speed.toFixed(2).replace(/0$/, '').replace(/\.$/, '.0') + '\u00D7';
        inP.value = phase;

        roSep.textContent = state.r.toFixed(2) + ' a';
        roRL.textContent = state.RL.toFixed(3) + ' a';
        roFrac.textContent = Math.round(rlofFraction() * 100) + '% of orbit';
        const ratio = Math.pow((1 + e) / (1 - e), 2);
        roRho.textContent = '\u00D7' + (ratio >= 100 ? ratio.toFixed(0) : ratio.toFixed(1));
        roBHL.textContent = state.bhl >= 10 ? '> 10 a' : state.bhl.toFixed(2) + ' a';
        roBound.textContent = String(boundN);
        roAcc.textContent = String(accreted);

        if (mode === 'wind') badge.textContent = 'Wind accretion';
        else badge.textContent = state.active ? 'Roche-lobe overflow' : 'Detached';
        badge.classList.toggle('on', mode === 'rlof' && state.active);

        const key = mode + ':' + state.active;
        if (lastKey !== key) {
            if (mode === 'wind') status.textContent = 'Wind accretion: the donor loses mass as a wind and the accretor captures part of it.';
            else status.textContent = state.active
                ? 'Donor is filling its Roche lobe: gas flows through the inner Lagrange point onto the accretor.'
                : 'Donor is inside its Roche lobe: no overflow, no mass transfer.';
            lastKey = key;
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
        const dphase = dt * speed / PERIOD_SECONDS;
        stepGas(phase, dphase);
        phase = (phase + dphase) % 1;
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

    /* ----- mode switch (wind accretion / RLOF) ----- */
    function setMode(m) {
        mode = m;
        modeWind.classList.toggle('is-on', m === 'wind');
        modeRlof.classList.toggle('is-on', m === 'rlof');
        modeWind.setAttribute('aria-pressed', String(m === 'wind'));
        modeRlof.setAttribute('aria-pressed', String(m === 'rlof'));
        lblW.hidden = m !== 'wind';
        readout.querySelectorAll('[data-only]').forEach(el => { el.hidden = el.dataset.only !== m; });
        chart.setAttribute('aria-label', m === 'wind'
            ? 'Chart of the wind density at the accretor against orbital phase'
            : 'Chart of donor radius and Roche lobe radius against orbital phase');
        lastKey = null;
        warmUp();
        draw(performance.now());
    }
    modeWind.addEventListener('click', () => setMode('wind'));
    modeRlof.addEventListener('click', () => setMode('rlof'));

    /* ----- controls ----- */
    function bind(input, fn, rebuildGas) {
        input.addEventListener('input', () => {
            fn(parseFloat(input.value));
            if (rebuildGas) warmUp();
            draw(performance.now());
        });
    }
    bind(inE, v => { e = v; }, true);
    bind(inQ, v => { q = v; }, true);
    bind(inR, v => { Rd = v; }, true);
    bind(inW, v => { vw = v; }, true);
    bind(inS, v => { speed = v; }, false);
    inP.addEventListener('input', () => {
        phase = parseFloat(inP.value) % 1;
        if (playing) setPlaying(false);
        warmUp();
        draw(performance.now());
    });

    playBtn.addEventListener('click', () => setPlaying(!playing));
    resetBtn.addEventListener('click', () => {
        e = DEFAULTS.e; q = DEFAULTS.q; Rd = DEFAULTS.R; speed = DEFAULTS.s; vw = DEFAULTS.w; phase = DEFAULTS.phase;
        inE.value = e; inQ.value = q; inR.value = Rd; inS.value = speed; inW.value = vw; inP.value = phase;
        lastKey = null;
        warmUp();
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

    // Initial state: wind mode, with a first snapshot of gas already in place
    modeWind.classList.add('is-on');
    readout.querySelectorAll('[data-only]').forEach(el => { el.hidden = el.dataset.only !== mode; });
    warmUp();
    resize();

    // Respect reduced-motion: start paused. Otherwise start playing.
    if (!reduceMotion) setPlaying(true);
})();
