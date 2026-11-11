/* =====================================================
   Realistic spiral galaxy — dense core, 4 spiral arms,
   HII regions, dust lanes, soft glow.
   ===================================================== */

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeButtons();
}));

const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const posterLink = document.getElementById('posterLink');
if (posterLink) {
    fetch(posterLink.getAttribute('href'), { method: 'HEAD' })
        .then(r => { if (r.ok) posterLink.hidden = false; })
        .catch(() => {});
}

/* ---------- stars & sections ---------- */
const HOME = { id: 'home', label: 'Rohit Kumar', desc: 'Start here', crumb: 'Home' };
const STAR_DEFS = [
    { id: 'about',       label: 'About me',    desc: 'Personal information and where I come from',   crumb: 'About me',    color: [255, 190, 100] },
    { id: 'research',    label: 'Research',    desc: 'Accretion in eccentric binaries',              crumb: 'Research',    color: [110, 200, 255] },
    { id: 'education',   label: 'Education',   desc: 'Degrees and school',                            crumb: 'Education',   color: [255, 130, 170] },
    { id: 'conferences', label: 'Conferences', desc: 'Talks and posters',                             crumb: 'Conferences', color: [180, 150, 255] },
    { id: 'training',    label: 'Workshops',   desc: 'Schools, workshops, internships',               crumb: 'Workshops',   color: [120, 230, 180] },
    { id: 'projects',    label: 'Projects',    desc: 'What I have built and analysed',                crumb: 'Projects',    color: [255, 160, 80] },
    { id: 'skills',      label: 'Skills',      desc: 'Tools and methods',                             crumb: 'Skills',      color: [140, 190, 255] },
    { id: 'teaching',    label: 'Teaching',    desc: 'Four years in the classroom',                   crumb: 'Teaching',    color: [255, 220, 130] },
    { id: 'writing',     label: 'Blog',        desc: 'Question Everything',                           crumb: 'Writing',     color: [255, 110, 130] },
    { id: 'contact',     label: 'Contact',     desc: 'Get in touch',                                  crumb: 'Contact',     color: [130, 240, 150] }
];
const RADII = [0.28, 0.36, 0.44, 0.52, 0.60, 0.67, 0.74, 0.80, 0.87, 0.93];
const STARS = STAR_DEFS.map((d, i) => Object.assign({}, d, {
    r: RADII[i],
    a: 0.6 + i * 2.399,
    w: 0.034 + 0.018 * (1 - RADII[i]),
    sx: 0, sy: 0, lx: 0, ly: 0, lw: 0, lh: 0
}));
const BY_ID = {};
[HOME].concat(STARS).forEach(s => { BY_ID[s.id] = s; });
HOME.sx = HOME.sy = 0; HOME.lx = HOME.ly = HOME.lw = HOME.lh = 0;

/* ---------- panel open/close ---------- */
const panel = document.getElementById('fullpage');
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
    if (updateHash !== false) { try { history.replaceState(null, '', '#' + id); } catch (e) {} }
}
function closePanel(updateHash) {
    if (!panelOpen) return;
    panelOpen = false;
    panel.classList.remove('open');
    scrim.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    setInert(false);
    if (updateHash !== false) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
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
   THE GALAXY CANVAS
   ===================================================== */
(function () {
    const cv = document.getElementById('galaxy');
    const ctx = cv.getContext('2d');
    const TAU = Math.PI * 2;

    /* deterministic RNG */
    let seed = 20251011;
    function rnd() {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    function gauss() { return (rnd() + rnd() + rnd() + rnd() - 2) / 0.58; }

    /* ----- star populations ----- */
    const N_ARMS   = 3200;   // blue-white young stars along arms
    const N_BULGE  = 900;    // warm stars in bulge
    const N_HALO   = 240;    // sparse faint halo
    const N_HII    = 140;    // pink HII regions
    const N = N_ARMS + N_BULGE + N_HALO + N_HII;

    const pr   = new Float32Array(N);   // radius 0..1
    const pa   = new Float32Array(N);   // angle
    const pw   = new Float32Array(N);   // angular speed
    const ps   = new Float32Array(N);   // pixel size
    const pcol = new Array(N);          // fill style

    // warm core → orange mid → blue-white outer
    function armColour(r) {
        const t = Math.min(1, r);
        // core: warm white-yellow ; mid: orange-pink ; outer: blue-white
        let R, G, B, A;
        if (t < 0.25) {
            const k = t / 0.25;
            R = 255; G = Math.round(240 - 20 * k); B = Math.round(210 - 40 * k); A = 0.9;
        } else if (t < 0.6) {
            const k = (t - 0.25) / 0.35;
            R = 255; G = Math.round(220 - 30 * k); B = Math.round(170 + 20 * k); A = 0.85;
        } else {
            const k = (t - 0.6) / 0.4;
            R = Math.round(255 - 40 * k); G = Math.round(190 + 30 * k); B = 255; A = 0.7 - 0.2 * k;
        }
        return 'rgba(' + R + ',' + G + ',' + B + ',' + A.toFixed(2) + ')';
    }
    function bulgeColour() {
        const t = rnd();
        const R = 255;
        const G = Math.round(225 - 25 * t);
        const B = Math.round(165 - 40 * t);
        return 'rgba(' + R + ',' + G + ',' + B + ',' + (0.75 + rnd() * 0.25).toFixed(2) + ')';
    }
    function haloColour() {
        return 'rgba(210,220,255,' + (0.3 + rnd() * 0.4).toFixed(2) + ')';
    }
    function hiiColour() {
        return 'rgba(255,' + Math.round(90 + rnd() * 60) + ',' + Math.round(130 + rnd() * 60) + ',' + (0.6 + rnd() * 0.4).toFixed(2) + ')';
    }

    // angular speed — flat rotation curve, faster near centre
    function omega(r) { return 0.05 + 0.09 / (1 + 4 * r); }

    for (let i = 0; i < N; i++) {
        let r, a, size;
        if (i < N_ARMS) {
            // spiral arms: log-ish spiral, 4 arms, with scatter that grows outward
            r = 0.08 + 0.92 * Math.pow(rnd(), 0.85);
            const arm = i % 4;
            const armPhase = arm * Math.PI / 2 + r * 6.0;  // tight enough to be visible
            const scatter = 0.06 + 0.22 * r;               // arms get fuzzier far out
            a = armPhase + gauss() * scatter;
            size = 0.55 + rnd() * 0.9;
            pcol[i] = armColour(r);
        } else if (i < N_ARMS + N_BULGE) {
            // bulge: dense, concentrated, warm
            r = Math.pow(rnd(), 2.6) * 0.28;
            a = rnd() * TAU;
            size = 0.45 + rnd() * 0.85;
            pcol[i] = bulgeColour();
        } else if (i < N_ARMS + N_BULGE + N_HALO) {
            // faint halo
            r = 0.15 + rnd() * 0.95;
            a = rnd() * TAU;
            size = 0.35 + rnd() * 0.55;
            pcol[i] = haloColour();
        } else {
            // HII regions — sit on the arms, pink-red
            r = 0.18 + 0.82 * Math.pow(rnd(), 0.9);
            const arm = i % 4;
            a = arm * Math.PI / 2 + r * 6.0 + gauss() * (0.04 + 0.1 * r);
            size = 1.2 + rnd() * 1.8;
            pcol[i] = hiiColour();
        }
        pr[i] = r; pa[i] = a; pw[i] = omega(r); ps[i] = size;
    }

    /* ----- pre-rendered sprites for soft glow / dust ----- */
    function sprite(rgb, size, inner, mid) {
        const c = document.createElement('canvas'); c.width = c.height = size;
        const g = c.getContext('2d');
        const gr = g.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        gr.addColorStop(0,   'rgba(' + rgb + ',' + inner + ')');
        gr.addColorStop(0.45,'rgba(' + rgb + ',' + mid + ')');
        gr.addColorStop(1,   'rgba(' + rgb + ',0)');
        g.fillStyle = gr; g.fillRect(0, 0, size, size);
        return c;
    }

    // nebula haze along arms
    const N_HAZE = 320;
    const hr = new Float32Array(N_HAZE), ha = new Float32Array(N_HAZE);
    const hw = new Float32Array(N_HAZE), hs = new Float32Array(N_HAZE), hc = new Uint8Array(N_HAZE);
    for (let i = 0; i < N_HAZE; i++) {
        const r = 0.1 + 0.88 * Math.pow(rnd(), 0.9);
        hr[i] = r;
        ha[i] = (i % 4) * Math.PI / 2 + r * 6.0 + gauss() * (0.05 + 0.15 * r);
        hw[i] = omega(r);
        hs[i] = 0.05 + rnd() * 0.09;
        hc[i] = Math.floor(rnd() * 4);
    }
    const HAZE = [
        sprite('120, 160, 255', 64, 0.55, 0.16),   // blue haze
        sprite('255, 150, 190', 64, 0.55, 0.16),   // pink haze
        sprite('255, 190, 130', 64, 0.55, 0.16),   // warm haze
        sprite('140, 210, 200', 64, 0.55, 0.14)    // teal haze
    ];

    // dust lane sprite (dark, multiplied)
    const DUST = sprite('20, 15, 35', 64, 0.85, 0.25);

    const N_DUST = 180;
    const dr = new Float32Array(N_DUST), da = new Float32Array(N_DUST);
    const dw = new Float32Array(N_DUST), ds = new Float32Array(N_DUST), dc = new Float32Array(N_DUST);
    for (let i = 0; i < N_DUST; i++) {
        const r = 0.15 + 0.8 * Math.pow(rnd(), 0.9);
        dr[i] = r;
        // dust sits slightly inside the arms (trailing edge)
        const arm = i % 4;
        da[i] = arm * Math.PI / 2 + r * 6.0 - 0.18 + gauss() * (0.04 + 0.1 * r);
        dw[i] = omega(r);
        ds[i] = 0.06 + rnd() * 0.12;
        dc[i] = 0.25 + rnd() * 0.45;   // alpha
    }

    /* ----- core glow sprites ----- */
    const CORE_BIG  = sprite('255, 220, 150', 256, 0.55, 0.18);
    const CORE_MID  = sprite('255, 235, 190', 128, 0.7, 0.25);
    const CORE_HOT  = sprite('255, 250, 235', 64, 0.95, 0.35);

    /* ----- geometry ----- */
    let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, R = 0;
    let tilt = 0.55, cphi = 1, sphi = 0;
    const PHI = -0.32;
    let bg = null;

    function makeBackground() {
        bg = document.createElement('canvas');
        bg.width = Math.round(W * DPR); bg.height = Math.round(H * DPR);
        const g = bg.getContext('2d');
        g.scale(DPR, DPR);

        // deep space gradient (very dark blue-purple)
        const grad = g.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
        grad.addColorStop(0,    '#10132a');
        grad.addColorStop(0.45, '#080a18');
        grad.addColorStop(1,    '#03040a');
        g.fillStyle = grad;
        g.fillRect(0, 0, W, H);

        // faint distant background stars
        const n = Math.round(W * H / 2600);
        for (let i = 0; i < n; i++) {
            const o = 0.1 + rnd() * 0.55;
            const s = 0.3 + rnd() * 0.8;
            g.fillStyle = (rnd() < 0.2 ? 'rgba(255,220,190,' : 'rgba(200,215,255,') + o.toFixed(2) + ')';
            g.fillRect(rnd() * W, rnd() * H, s, s);
        }
    }

    function resize() {
        W = window.innerWidth; H = window.innerHeight;
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        tilt = W < H * 0.9 ? 0.78 : 0.55;
        cphi = Math.cos(PHI); sphi = Math.sin(PHI);
        R = Math.min(W * 0.46, H * 0.5 / (tilt + 0.28));
        cx = W / 2; cy = H / 2 + Math.min(14, H * 0.02);
        makeBackground();
        if (!looping) draw();
    }

    let hovered = null, timeScale = 1, looping = false, last = 0, clock = 0;
    const targetScale = () => (reduceMotion ? 0 : hovered ? 0.2 : 1);

    function project(r, a) {
        const X = Math.cos(a) * r * R;
        const Y = Math.sin(a) * r * R * tilt;
        return [
            cx + X * cphi - Y * sphi,
            cy + X * sphi + Y * cphi
        ];
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        if (bg) ctx.drawImage(bg, 0, 0, W, H);

        /* ===== 1) outer disc glow (soft warm bloom around the galaxy) ===== */
        ctx.globalCompositeOperation = 'lighter';
        const discR = R * 1.15;
        const discGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, discR);
        discGrad.addColorStop(0,    'rgba(255, 210, 150, 0.35)');
        discGrad.addColorStop(0.2,  'rgba(255, 170, 140, 0.18)');
        discGrad.addColorStop(0.5,  'rgba(140, 170, 255, 0.10)');
        discGrad.addColorStop(0.8,  'rgba(110, 200, 200, 0.05)');
        discGrad.addColorStop(1,    'rgba(100, 130, 200, 0)');
        ctx.fillStyle = discGrad;
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(1, tilt); ctx.translate(-cx, -cy);
        ctx.beginPath(); ctx.arc(cx, cy, discR, 0, TAU); ctx.fill();
        ctx.restore();

        /* ===== 2) arm haze (soft colored nebula along arms) ===== */
        for (let i = 0; i < N_HAZE; i++) {
            const [x, y] = project(hr[i], ha[i]);
            const s = hs[i] * R * 2.2;
            ctx.globalAlpha = 0.35;
            ctx.drawImage(HAZE[hc[i]], x - s / 2, y - s / 2, s, s);
        }
        ctx.globalAlpha = 1;

        /* ===== 3) dust lanes (dark, drawn with multiply) ===== */
        ctx.globalCompositeOperation = 'multiply';
        for (let i = 0; i < N_DUST; i++) {
            const [x, y] = project(dr[i], da[i]);
            const s = ds[i] * R * 2.4;
            ctx.globalAlpha = dc[i];
            ctx.drawImage(DUST, x - s / 2, y - s / 2, s, s);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'lighter';

        /* ===== 4) halo stars (faint) ===== */
        for (let i = N_ARMS + N_BULGE; i < N_ARMS + N_BULGE + N_HALO; i++) {
            const [x, y] = project(pr[i], pa[i]);
            const s = ps[i];
            ctx.fillStyle = pcol[i];
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }

        /* ===== 5) arm stars (bright) ===== */
        for (let i = 0; i < N_ARMS; i++) {
            const [x, y] = project(pr[i], pa[i]);
            const s = ps[i];
            ctx.fillStyle = pcol[i];
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }

        /* ===== 6) bulge stars (dense, warm) ===== */
        for (let i = N_ARMS; i < N_ARMS + N_BULGE; i++) {
            const [x, y] = project(pr[i], pa[i]);
            const s = ps[i];
            ctx.fillStyle = pcol[i];
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }

        /* ===== 7) HII regions (pink knots on arms) ===== */
        for (let i = N_ARMS + N_BULGE + N_HALO; i < N; i++) {
            const [x, y] = project(pr[i], pa[i]);
            const s = ps[i];
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = pcol[i];
            ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill();
            // soft pink glow around each HII region
            ctx.globalAlpha = 0.25;
            ctx.drawImage(HAZE[1], x - s * 3, y - s * 3, s * 6, s * 6);
        }
        ctx.globalAlpha = 1;

        /* ===== 8) bright core bloom ===== */
        const pulse = reduceMotion ? 0 : Math.sin(clock * 1.5) * 0.03;
        const coreScale = 1 + pulse;
        ctx.drawImage(CORE_BIG, cx - R * 0.55 * coreScale, cy - R * 0.55 * tilt * coreScale, R * 1.1 * coreScale, R * 1.1 * tilt * coreScale);
        ctx.drawImage(CORE_MID, cx - R * 0.22 * coreScale, cy - R * 0.22 * tilt * coreScale, R * 0.44 * coreScale, R * 0.44 * tilt * coreScale);
        ctx.drawImage(CORE_HOT, cx - R * 0.07, cy - R * 0.07 * tilt, R * 0.14, R * 0.14 * tilt);

        /* ===== 9) transit to normal blending for labels ===== */
        ctx.globalCompositeOperation = 'source-over';

        /* ===== 10) orbit rings (subtle, per labelled star) ===== */
        ctx.lineWidth = 1;
        for (const s of STARS) {
            ctx.strokeStyle = 'rgba(' + s.color.join(',') + ',' + (s === hovered ? '0.5' : '0.16') + ')';
            ctx.beginPath();
            for (let k = 0; k <= 96; k++) {
                const t = k / 96 * TAU;
                const [x, y] = project(s.r, t);
                if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        /* ===== 11) labelled stars + labels ===== */
        const fs = W < 640 ? 12 : 14;
        HOME.sx = cx; HOME.sy = cy;
        for (const s of STARS) {
            const [x, y] = project(s.r, s.a);
            s.sx = x; s.sy = y;
        }

        // glowing dots for labelled stars
        ctx.globalCompositeOperation = 'lighter';
        for (const s of STARS) {
            const on = s === hovered;
            const rgb = s.color.join(',');
            const rad = (on ? 10 : 7) + (reduceMotion ? 0 : Math.sin(clock * 2.2 + s.r * 10) * 0.8);
            const g = ctx.createRadialGradient(s.sx, s.sy, 0, s.sx, s.sy, rad * 6);
            g.addColorStop(0, 'rgba(' + rgb + ',' + (on ? 0.95 : 0.7) + ')');
            g.addColorStop(0.35, 'rgba(' + rgb + ',' + (on ? 0.4 : 0.25) + ')');
            g.addColorStop(1, 'rgba(' + rgb + ',0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(s.sx, s.sy, rad * 6, 0, TAU); ctx.fill();
            // bright point
            ctx.fillStyle = 'rgba(255,255,255,' + (on ? 1 : 0.9) + ')';
            ctx.beginPath(); ctx.arc(s.sx, s.sy, on ? 3.2 : 2.4, 0, TAU); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';

        // labels
        ctx.textBaseline = 'middle';
        const items = STARS.concat([HOME]);
        for (const s of items) {
            const on = s === hovered, isHome = s === HOME;
            const text = s.label;
            ctx.font = isHome
                ? '400 ' + (fs + 10) + 'px "Instrument Serif", Georgia, serif'
                : '600 ' + fs + 'px "IBM Plex Sans", sans-serif';
            const tw = ctx.measureText(text).width;
            const padX = isHome ? 14 : 10;
            const bh = isHome ? fs + 20 : fs + 12;
            const bw = tw + padX * 2;
            let x, y;
            if (isHome) {
                x = s.sx - bw / 2;
                y = s.sy + R * 0.09;
            } else {
                const left = s.sx > W * 0.7;
                x = left ? s.sx - 16 - bw : s.sx + 16;
                y = s.sy - bh / 2;
            }
            s.lx = x; s.ly = y; s.lw = bw; s.lh = bh;

            ctx.fillStyle = on ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.94)';
            ctx.strokeStyle = on
                ? 'rgba(' + (isHome ? '220,155,70' : s.color.join(',')) + ',1)'
                : 'rgba(' + (isHome ? '200,180,150' : s.color.join(',')) + ',0.45)';
            ctx.lineWidth = on ? 2 : 1;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, bh / 2); else ctx.rect(x, y, bw, bh);
            ctx.shadowColor = on ? 'rgba(' + s.color.join(',') + ',0.55)' : 'transparent';
            ctx.shadowBlur = on ? 14 : 0;
            ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#1a2a4a';
            ctx.textAlign = 'left';
            ctx.fillText(text, x + padX, y + bh / 2 + (isHome ? 1 : 0.5));
        }

        /* ===== 12) hover description ===== */
        if (hovered) {
            ctx.font = '400 ' + (fs - 1) + 'px "IBM Plex Sans", sans-serif';
            ctx.textAlign = 'left';
            const tw = ctx.measureText(hovered.desc).width;
            let x = hovered.lx, y = hovered.ly + hovered.lh + 14;
            if (x + tw > W - 10) x = W - 10 - tw;
            if (x < 10) x = 10;
            ctx.fillStyle = 'rgba(255,255,255,0.98)';
            ctx.strokeStyle = 'rgba(' + hovered.color.join(',') + ',0.35)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x - 8, y - 11, tw + 16, 22, 6);
            else ctx.rect(x - 8, y - 11, tw + 16, 22);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#4a5a7a';
            ctx.fillText(hovered.desc, x, y);
        }
    }

    /* ----- animation loop ----- */
    function frame(t) {
        if (panelOpen || document.hidden) { looping = false; return; }
        const dt = Math.min(0.05, (t - (last || t)) / 1000);
        last = t;
        timeScale += (targetScale() - timeScale) * Math.min(1, dt * 6);
        const k = dt * timeScale;
        clock += dt;
        for (let i = 0; i < N; i++) pa[i] += pw[i] * k;
        for (let i = 0; i < N_HAZE; i++) ha[i] += hw[i] * k;
        for (let i = 0; i < N_DUST; i++) da[i] += dw[i] * k;
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

    /* ----- pointer interaction ----- */
    function hit(px, py) {
        let best = null, bd = Infinity;
        const items = STARS.concat([HOME]);
        for (const s of items) {
            const d = Math.hypot(px - s.sx, py - s.sy);
            const inLabel = px >= s.lx && px <= s.lx + s.lw && py >= s.ly && py <= s.ly + s.lh;
            const reach = s === HOME ? Math.max(26, R * 0.09) : 24;
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
