/* =====================================================
   Rohit Kumar, academic site: the galaxy.
   A canvas galaxy (thousands of stars orbiting the centre)
   with ten clickable, labelled stars. Each opens a panel
   with one section of the site. sim.js (the binary-star
   explainer) loads after this file and uses `reduceMotion`.
   ===================================================== */

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Theme (affects the panel; the galaxy is always night) ---------- */
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

/* ---------- Misc small things ---------- */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const posterLink = document.getElementById('posterLink');
if (posterLink) {
    fetch(posterLink.getAttribute('href'), { method: 'HEAD' })
        .then(r => { if (r.ok) posterLink.hidden = false; })
        .catch(() => {});
}

/* ---------- The stars (one per section) ----------
   r = orbit radius (0..1 of the galaxy), a = starting angle.
   Edit labels / descriptions / colours here. */
const HOME = { id: 'home', label: 'Rohit Kumar', desc: 'Start here', crumb: 'Home' };
const STAR_DEFS = [
    { id: 'about',       label: 'About me',     desc: 'Personal information and where I come from', crumb: 'About me',     color: [255, 205, 120] },
    { id: 'research',    label: 'Research',     desc: 'Accretion in eccentric binaries + interactive model', crumb: 'Research', color: [120, 220, 255] },
    { id: 'education',   label: 'Education',    desc: 'Degrees and school',               crumb: 'Education',    color: [255, 150, 190] },
    { id: 'conferences', label: 'Conferences',  desc: 'Talks and posters',                crumb: 'Conferences',  color: [190, 170, 255] },
    { id: 'training',    label: 'Workshops',    desc: 'Schools, workshops, internships',  crumb: 'Workshops',    color: [140, 255, 200] },
    { id: 'projects',    label: 'Projects',     desc: 'What I have built and analysed',   crumb: 'Projects',     color: [255, 175, 100] },
    { id: 'skills',      label: 'Skills',       desc: 'Tools and methods',                crumb: 'Skills',       color: [150, 200, 255] },
    { id: 'teaching',    label: 'Teaching',     desc: 'Four years in the classroom',      crumb: 'Teaching',     color: [255, 230, 150] },
    { id: 'writing',     label: 'Blog',         desc: 'Question Everything',              crumb: 'Writing',      color: [255, 130, 150] },
    { id: 'contact',     label: 'Contact',      desc: 'Get in touch',                     crumb: 'Contact',      color: [160, 255, 170] }
];
const RADII = [0.27, 0.34, 0.42, 0.5, 0.58, 0.65, 0.72, 0.79, 0.86, 0.92];
const STARS = STAR_DEFS.map((d, i) => Object.assign({}, d, {
    r: RADII[i],
    a: 0.6 + i * 2.399,                       // golden angle: spreads the stars out
    w: 0.034 + 0.018 * (1 - RADII[i]),        // slow, gently differential rotation (rad/s)
    sx: 0, sy: 0, lx: 0, ly: 0, lw: 0, lh: 0
}));
const BY_ID = {};
[HOME].concat(STARS).forEach(s => { BY_ID[s.id] = s; });
HOME.sx = HOME.sy = 0; HOME.lx = HOME.ly = HOME.lw = HOME.lh = 0;

/* ---------- Panel (open / close) ---------- */
const panel = document.getElementById('panel');
const scrim = document.getElementById('scrim');
const closeBtn = document.getElementById('panelClose');
const crumb = document.getElementById('panelCrumb');
const panes = Array.from(document.querySelectorAll('.pane'));
const inertTargets = Array.from(document.querySelectorAll('#galaxy, .g-head, .g-hint, #starIndexWrap'));
let panelOpen = false, lastFocus = null, startLoop = () => {};

function setInert(on) { inertTargets.forEach(el => { el.inert = on; }); }

function openStar(id, updateHash) {
    const s = BY_ID[id];
    if (!s) return;
    panes.forEach(p => { p.hidden = p.dataset.id !== id; });
    crumb.textContent = s.crumb || s.label;
    panel.setAttribute('aria-label', s.crumb || s.label);
    panel.scrollTop = 0;
    if (!panelOpen) lastFocus = document.activeElement;
    panelOpen = true;
    panel.classList.add('open');
    scrim.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    setInert(true);
    closeBtn.focus({ preventScroll: true });
    if (updateHash !== false) { try { history.replaceState(null, '', '#' + id); } catch (e) { /* file:// */ } }
}
function closePanel(updateHash) {
    if (!panelOpen) return;
    panelOpen = false;
    panel.classList.remove('open');
    scrim.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    setInert(false);
    if (updateHash !== false) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* file:// */ } }
    if (lastFocus && document.contains(lastFocus) && lastFocus !== document.body) lastFocus.focus({ preventScroll: true });
    startLoop();
}
closeBtn.addEventListener('click', () => closePanel());
scrim.addEventListener('click', () => closePanel());
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (panelOpen) closePanel();
        else if (!indexList.hidden) setIndex(false);
    }
});
window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (BY_ID[id]) openStar(id, false); else closePanel(false);
});

/* ---------- "All stars" list (keyboard / small-screen route to every section) ---------- */
const indexBtn = document.getElementById('starIndexBtn');
const indexList = document.getElementById('starIndex');
[HOME].concat(STARS).forEach(s => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span></span><small></small>';
    b.firstChild.textContent = s.label;
    b.lastChild.textContent = s.desc;
    b.addEventListener('click', () => { setIndex(false); openStar(s.id); });
    li.appendChild(b);
    indexList.appendChild(li);
});
function setIndex(open) {
    indexList.hidden = !open;
    indexBtn.setAttribute('aria-expanded', String(open));
}
indexBtn.addEventListener('click', e => { e.stopPropagation(); setIndex(indexList.hidden); });
document.addEventListener('click', e => { if (!indexList.hidden && !e.target.closest('#starIndexWrap')) setIndex(false); });

/* =====================================================
   The galaxy canvas
   ===================================================== */
(function () {
    const cv = document.getElementById('galaxy');
    const ctx = cv.getContext('2d');
    const TAU = Math.PI * 2;

    /* deterministic random numbers, so the galaxy looks the same on every visit */
    let seed = 20251011;
    function rnd() {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    function gauss() { return (rnd() + rnd() + rnd() + rnd() - 2) / 0.58; }   // about N(0, 1)

    /* ----- stars of the disc: bulge + two spiral arms + a faint halo ----- */
    const N_ARM = 1500, N_BULGE = 500, N_HALO = 260, N = N_ARM + N_BULGE + N_HALO;
    const pr = new Float32Array(N), pa = new Float32Array(N), pw = new Float32Array(N), ps = new Float32Array(N);
    const pcol = new Array(N);

    function colour(r, hii) {
        if (hii) return 'rgba(255,150,190,' + (0.55 + rnd() * 0.4).toFixed(2) + ')';
        const t = Math.min(1, r / 0.95);
        const R = Math.round(255 - 90 * t), G = Math.round(224 - 20 * t), B = Math.round(175 + 80 * t);
        return 'rgba(' + R + ',' + G + ',' + B + ',' + (0.35 + rnd() * 0.6).toFixed(2) + ')';
    }
    function omega(r) { return 0.03 + 0.06 / (1 + 3 * r); }   // rad/s, faster near the centre

    for (let i = 0; i < N; i++) {
        let r, a, hii = false, size = 0.6 + rnd() * 1.0;
        if (i < N_ARM) {
            r = 0.03 + 0.97 * Math.pow(rnd(), 0.8);
            const arm = i % 2;
            a = arm * Math.PI + r * 5.4 + gauss() * (0.1 + 0.3 * r);
            hii = rnd() < 0.06;
        } else if (i < N_ARM + N_BULGE) {
            r = Math.pow(rnd(), 2) * 0.24;
            a = rnd() * TAU;
            size = 0.5 + rnd() * 0.9;
        } else {
            r = 0.1 + rnd() * 1.0;
            a = rnd() * TAU;
            size = 0.4 + rnd() * 0.6;
        }
        pr[i] = r; pa[i] = a; pw[i] = omega(r); ps[i] = size;
        pcol[i] = colour(r, hii);
    }

    /* ----- soft gas / dust haze along the arms (drawn with a pre-rendered sprite) ----- */
    const N_HAZE = 200;
    const hr = new Float32Array(N_HAZE), ha = new Float32Array(N_HAZE), hw = new Float32Array(N_HAZE), hs = new Float32Array(N_HAZE), hc = new Uint8Array(N_HAZE);
    for (let i = 0; i < N_HAZE; i++) {
        const r = 0.08 + 0.9 * Math.pow(rnd(), 0.9);
        hr[i] = r; ha[i] = (i % 2) * Math.PI + r * 5.4 + gauss() * (0.1 + 0.25 * r);
        hw[i] = omega(r); hs[i] = 0.05 + rnd() * 0.08; hc[i] = rnd() < 0.5 ? 0 : 1;
    }
    function sprite(rgb) {
        const c = document.createElement('canvas'); c.width = c.height = 64;
        const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, 'rgba(' + rgb + ',0.9)'); gr.addColorStop(0.4, 'rgba(' + rgb + ',0.25)'); gr.addColorStop(1, 'rgba(' + rgb + ',0)');
        g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
        return c;
    }
    const HAZE = [sprite('110,150,255'), sprite('255,190,140')];

    /* ----- geometry ----- */
    let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, R = 0, tilt = 0.52, cphi = 1, sphi = 0;
    const PHI = -0.32;
    let bg = null;

    function makeBackground() {
        bg = document.createElement('canvas');
        bg.width = Math.round(W * DPR); bg.height = Math.round(H * DPR);
        const g = bg.getContext('2d');
        g.scale(DPR, DPR);
        const n = Math.round(W * H / 3200);
        for (let i = 0; i < n; i++) {
            const o = 0.15 + rnd() * 0.6, s = 0.3 + rnd() * 0.9;
            g.fillStyle = (rnd() < 0.15 ? 'rgba(255,225,190,' : 'rgba(215,225,255,') + o.toFixed(2) + ')';
            g.fillRect(rnd() * W, rnd() * H, s, s);
        }
    }
    function resize() {
        W = window.innerWidth; H = window.innerHeight;
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        tilt = W < H * 0.9 ? 0.78 : 0.52;
        cphi = Math.cos(PHI); sphi = Math.sin(PHI);
        R = Math.min(W * 0.46, H * 0.5 / (tilt + 0.3));
        cx = W / 2; cy = H / 2 + Math.min(14, H * 0.02);
        makeBackground();
        if (!looping) draw();
    }

    /* ----- interaction state ----- */
    let hovered = null, timeScale = 1, looping = false, last = 0, clock = 0;
    const targetScale = () => (reduceMotion ? 0 : hovered ? 0.15 : 1);

    function drawGlow(x, y, rad, rgb, a) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
        g.addColorStop(1, 'rgba(' + rgb + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        if (bg) ctx.drawImage(bg, 0, 0, W, H);

        ctx.globalCompositeOperation = 'lighter';

        /* core glow and the galactic disc glow */
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(PHI); ctx.scale(1, tilt);
        const disc = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.05);
        disc.addColorStop(0, 'rgba(255,226,170,0.30)');
        disc.addColorStop(0.18, 'rgba(255,190,120,0.12)');
        disc.addColorStop(0.55, 'rgba(110,140,255,0.06)');
        disc.addColorStop(1, 'rgba(60,80,200,0)');
        ctx.fillStyle = disc;
        ctx.beginPath(); ctx.arc(0, 0, R * 1.05, 0, TAU); ctx.fill();
        ctx.restore();

        /* haze */
        for (let i = 0; i < N_HAZE; i++) {
            const r = hr[i], a = ha[i];
            const X = Math.cos(a) * r * R, Y = Math.sin(a) * r * R * tilt;
            const x = cx + X * cphi - Y * sphi, y = cy + X * sphi + Y * cphi, s = hs[i] * R * 2;
            ctx.globalAlpha = 0.07;
            ctx.drawImage(HAZE[hc[i]], x - s / 2, y - s / 2, s, s);
        }
        ctx.globalAlpha = 1;

        /* the many stars */
        for (let i = 0; i < N; i++) {
            const r = pr[i], a = pa[i];
            const X = Math.cos(a) * r * R, Y = Math.sin(a) * r * R * tilt;
            const s = ps[i];
            ctx.fillStyle = pcol[i];
            ctx.fillRect(cx + X * cphi - Y * sphi - s / 2, cy + X * sphi + Y * cphi - s / 2, s, s);
        }

        /* bright core */
        drawGlow(cx, cy, R * 0.16, '255,236,200', 0.55);
        drawGlow(cx, cy, R * 0.05, '255,255,255', 0.9);
        ctx.globalCompositeOperation = 'source-over';

        /* orbit rings of the labelled stars */
        ctx.lineWidth = 1;
        for (const s of STARS) {
            ctx.strokeStyle = 'rgba(' + s.color.join(',') + ',' + (s === hovered ? '0.32' : '0.08') + ')';
            ctx.beginPath();
            for (let k = 0; k <= 96; k++) {
                const t = k / 96 * TAU, X = Math.cos(t) * s.r * R, Y = Math.sin(t) * s.r * R * tilt;
                const x = cx + X * cphi - Y * sphi, y = cy + X * sphi + Y * cphi;
                if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        /* labelled stars + labels */
        const fs = W < 640 ? 11 : 13;
        const pulse = reduceMotion ? 0 : Math.sin(clock * 2.2);
        HOME.sx = cx; HOME.sy = cy;
        for (const s of STARS) {
            const X = Math.cos(s.a) * s.r * R, Y = Math.sin(s.a) * s.r * R * tilt;
            s.sx = cx + X * cphi - Y * sphi; s.sy = cy + X * sphi + Y * cphi;
        }
        ctx.globalCompositeOperation = 'lighter';
        for (const s of STARS) {
            const on = s === hovered, rgb = s.color.join(',');
            const rad = (on ? 7 : 5) + pulse * 0.8;
            drawGlow(s.sx, s.sy, rad * 5, rgb, on ? 0.6 : 0.38);
            drawGlow(s.sx, s.sy, rad * 1.6, '255,255,255', 0.85);
        }
        ctx.globalCompositeOperation = 'source-over';

        ctx.textBaseline = 'middle';
        const items = STARS.concat([HOME]);
        for (const s of items) {
            const on = s === hovered, isHome = s === HOME;
            const text = s.label;
            ctx.font = isHome ? '400 ' + (fs + 9) + 'px "Instrument Serif", Georgia, serif' : '500 ' + fs + 'px "IBM Plex Sans", sans-serif';
            const tw = ctx.measureText(text).width;
            const padX = isHome ? 12 : 9, bh = isHome ? fs + 18 : fs + 10;
            let bw = tw + padX * 2, x, y;
            if (isHome) { x = s.sx - bw / 2; y = s.sy + R * 0.075; }
            else {
                const left = s.sx > W * 0.7;
                x = left ? s.sx - 14 - bw : s.sx + 14; y = s.sy - bh / 2;
            }
            s.lx = x; s.ly = y; s.lw = bw; s.lh = bh;
            ctx.fillStyle = on ? 'rgba(14,20,40,0.92)' : 'rgba(7,10,18,0.62)';
            ctx.strokeStyle = on ? 'rgba(' + (isHome ? '255,226,170' : s.color.join(',')) + ',0.9)' : 'rgba(255,255,255,0.14)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, bh / 2); else ctx.rect(x, y, bw, bh);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = on ? '#fff' : '#d4daee';
            ctx.textAlign = 'left';
            ctx.fillText(text, x + padX, y + bh / 2 + (isHome ? 1 : 0.5));
        }

        /* description line for the hovered star */
        if (hovered) {
            ctx.font = '400 ' + (fs - 1) + 'px "IBM Plex Sans", sans-serif';
            ctx.textAlign = 'left';
            const tw = ctx.measureText(hovered.desc).width;
            let x = hovered.lx, y = hovered.ly + hovered.lh + 12;
            if (x + tw > W - 10) x = W - 10 - tw;
            ctx.fillStyle = 'rgba(7,10,18,0.8)';
            ctx.fillRect(x - 6, y - 9, tw + 12, 18);
            ctx.fillStyle = '#aab3cf';
            ctx.fillText(hovered.desc, x, y);
        }
    }

    /* ----- animation loop (stops while the panel is open or the tab is hidden) ----- */
    function frame(t) {
        if (panelOpen || document.hidden) { looping = false; return; }
        const dt = Math.min(0.05, (t - (last || t)) / 1000);
        last = t;
        timeScale += (targetScale() - timeScale) * Math.min(1, dt * 6);
        const k = dt * timeScale;
        clock += dt;
        for (let i = 0; i < N; i++) pa[i] += pw[i] * k;
        for (let i = 0; i < N_HAZE; i++) ha[i] += hw[i] * k;
        for (const s of STARS) s.a += s.w * k;
        draw();
        requestAnimationFrame(frame);
    }
    startLoop = function () {
        if (looping || panelOpen) return;
        looping = true; last = 0;
        requestAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', () => { if (!document.hidden) startLoop(); });

    /* ----- pointer: hover + click ----- */
    function hit(px, py) {
        let best = null, bd = Infinity;
        const items = STARS.concat([HOME]);
        for (const s of items) {
            const d = Math.hypot(px - s.sx, py - s.sy);
            const inLabel = px >= s.lx && px <= s.lx + s.lw && py >= s.ly && py <= s.ly + s.lh;
            const reach = s === HOME ? Math.max(22, R * 0.07) : 20;
            if (d < reach || inLabel) {
                const score = inLabel ? 0 : d;
                if (score < bd) { bd = score; best = s; }
            }
        }
        return best;
    }
    function pos(e) { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }
    cv.addEventListener('pointermove', e => {
        const p = pos(e), h = hit(p[0], p[1]);
        if (h !== hovered) {
            hovered = h;
            cv.style.cursor = h ? 'pointer' : 'default';
            if (!looping) draw();
        }
    });
    cv.addEventListener('pointerleave', () => { if (hovered) { hovered = null; cv.style.cursor = 'default'; if (!looping) draw(); } });
    cv.addEventListener('click', e => {
        const p = pos(e), h = hit(p[0], p[1]);
        if (h) { hovered = null; openStar(h.id); }
    });

    window.addEventListener('resize', resize);
    resize();
    draw();
    const initial = location.hash.slice(1);
    if (BY_ID[initial]) openStar(initial, false);
    startLoop();
})();
