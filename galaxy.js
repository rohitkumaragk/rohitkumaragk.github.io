/* Galaxy with 4 arms, colorful stars, white background */
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

const HOME = { id: 'home', label: 'Rohit Kumar', desc: 'Start here', crumb: 'Home' };
const STAR_DEFS = [
    { id: 'about', label: 'About me', desc: 'Personal information and where I come from', crumb: 'About me', color: [255, 180, 100] },
    { id: 'research', label: 'Research', desc: 'Accretion in eccentric binaries + interactive model', crumb: 'Research', color: [100, 200, 255] },
    { id: 'education', label: 'Education', desc: 'Degrees and school', crumb: 'Education', color: [255, 130, 170] },
    { id: 'conferences', label: 'Conferences', desc: 'Talks and posters', crumb: 'Conferences', color: [170, 150, 255] },
    { id: 'training', label: 'Workshops', desc: 'Schools, workshops, internships', crumb: 'Workshops', color: [120, 230, 180] },
    { id: 'projects', label: 'Projects', desc: 'What I have built and analysed', crumb: 'Projects', color: [255, 160, 80] },
    { id: 'skills', label: 'Skills', desc: 'Tools and methods', crumb: 'Skills', color: [130, 180, 255] },
    { id: 'teaching', label: 'Teaching', desc: 'Four years in the classroom', crumb: 'Teaching', color: [255, 220, 130] },
    { id: 'writing', label: 'Blog', desc: 'Question Everything', crumb: 'Writing', color: [255, 110, 130] },
    { id: 'contact', label: 'Contact', desc: 'Get in touch', crumb: 'Contact', color: [130, 240, 150] }
];
const RADII = [0.27, 0.34, 0.42, 0.5, 0.58, 0.65, 0.72, 0.79, 0.86, 0.92];
const STARS = STAR_DEFS.map((d, i) => Object.assign({}, d, {
    r: RADII[i],
    a: 0.6 + i * 2.399,
    w: 0.034 + 0.018 * (1 - RADII[i]),
    sx: 0, sy: 0, lx: 0, ly: 0, lw: 0, lh: 0
}));
const BY_ID = {};
[HOME].concat(STARS).forEach(s => { BY_ID[s.id] = s; });
HOME.sx = HOME.sy = 0; HOME.lx = HOME.ly = HOME.lw = HOME.lh = 0;

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

(function () {
    const cv = document.getElementById('galaxy');
    const ctx = cv.getContext('2d');
    const TAU = Math.PI * 2;

    let seed = 20251011;
    function rnd() {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    function gauss() { return (rnd() + rnd() + rnd() + rnd() - 2) / 0.58; }

    const N_ARM = 2400, N_BULGE = 600, N_HALO = 300, N = N_ARM + N_BULGE + N_HALO;
    const pr = new Float32Array(N), pa = new Float32Array(N), pw = new Float32Array(N), ps = new Float32Array(N);
    const pcol = new Array(N);

    function colour(r, hii) {
        if (hii) return 'rgba(255, 105, 145, ' + (0.6 + rnd() * 0.4).toFixed(2) + ')';
        const palette = [
            [255, 170, 100], [100, 170, 255], [170, 140, 255],
            [100, 210, 195], [245, 140, 185], [255, 215, 130],
            [255, 130, 80], [130, 200, 255], [200, 160, 255]
        ];
        const c = palette[Math.floor(rnd() * palette.length)];
        const t = Math.min(1, r / 1.0);
        const mix = 0.25 + 0.35 * t;
        const R = Math.round(c[0] * (1-mix) + 255 * mix);
        const G = Math.round(c[1] * (1-mix) + 255 * mix);
        const B = Math.round(c[2] * (1-mix) + 255 * mix);
        return 'rgba(' + R + ',' + G + ',' + B + ',' + (0.55 + rnd() * 0.45).toFixed(2) + ')';
    }
    function omega(r) { return 0.025 + 0.055 / (1 + 3 * r); }

    for (let i = 0; i < N; i++) {
        let r, a, hii = false, size = 0.7 + rnd() * 1.2;
        if (i < N_ARM) {
            r = 0.03 + 0.97 * Math.pow(rnd(), 0.75);
            const arm = i % 4;
            a = arm * Math.PI / 2 + r * 4.8 + gauss() * (0.05 + 0.18 * r);
            hii = rnd() < 0.08;
        } else if (i < N_ARM + N_BULGE) {
            r = Math.pow(rnd(), 2.2) * 0.22;
            a = rnd() * TAU;
            size = 0.6 + rnd() * 1.0;
        } else {
            r = 0.08 + rnd() * 0.95;
            a = rnd() * TAU;
            size = 0.5 + rnd() * 0.8;
        }
        pr[i] = r; pa[i] = a; pw[i] = omega(r); ps[i] = size;
        pcol[i] = colour(r, hii);
    }

    const N_HAZE = 250;
    const hr = new Float32Array(N_HAZE), ha = new Float32Array(N_HAZE), hw = new Float32Array(N_HAZE), hs = new Float32Array(N_HAZE), hc = new Uint8Array(N_HAZE);
    for (let i = 0; i < N_HAZE; i++) {
        const r = 0.08 + 0.88 * Math.pow(rnd(), 0.85);
        hr[i] = r;
        ha[i] = (i % 4) * Math.PI / 2 + r * 4.8 + gauss() * (0.06 + 0.18 * r);
        hw[i] = omega(r); hs[i] = 0.06 + rnd() * 0.1; hc[i] = Math.floor(rnd() * 5);
    }
    function sprite(rgb) {
        const c = document.createElement('canvas'); c.width = c.height = 64;
        const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, 'rgba(' + rgb + ',0.85)');
        gr.addColorStop(0.35, 'rgba(' + rgb + ',0.3)');
        gr.addColorStop(1, 'rgba(' + rgb + ',0)');
        g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
        return c;
    }
    const HAZE = [
        sprite('100, 160, 255'),
        sprite('255, 140, 180'),
        sprite('120, 210, 180'),
        sprite('255, 180, 120'),
        sprite('180, 150, 255')
    ];

    let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, R = 0, tilt = 0.52, cphi = 1, sphi = 0;
    const PHI = -0.32;
    let bg = null;

    function makeBackground() {
        bg = document.createElement('canvas');
        bg.width = Math.round(W * DPR); bg.height = Math.round(H * DPR);
        const g = bg.getContext('2d');
        g.scale(DPR, DPR);
        const grd = g.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.7);
        grd.addColorStop(0, '#ffffff');
        grd.addColorStop(0.6, '#f7f8fc');
        grd.addColorStop(1, '#edf1f8');
        g.fillStyle = grd;
        g.fillRect(0, 0, W, H);
        const n = Math.round(W * H / 4000);
        for (let i = 0; i < n; i++) {
            const o = 0.08 + rnd() * 0.25, s = 0.3 + rnd() * 0.7;
            g.fillStyle = (rnd() < 0.2 ? 'rgba(200,180,255,' : 'rgba(180,200,255,') + o.toFixed(2) + ')';
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

        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(PHI); ctx.scale(1, tilt);
        const disc = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.1);
        disc.addColorStop(0, 'rgba(255, 210, 150, 0.35)');
        disc.addColorStop(0.15, 'rgba(255, 170, 140, 0.18)');
        disc.addColorStop(0.4, 'rgba(140, 170, 255, 0.12)');
        disc.addColorStop(0.7, 'rgba(120, 210, 195, 0.08)');
        disc.addColorStop(1, 'rgba(150, 170, 230, 0)');
        ctx.fillStyle = disc;
        ctx.beginPath(); ctx.arc(0, 0, R * 1.1, 0, TAU); ctx.fill();
        ctx.restore();

        ctx.globalCompositeOperation = 'multiply';
        for (let i = 0; i < N_HAZE; i++) {
            const r = hr[i], a = ha[i];
            const X = Math.cos(a) * r * R, Y = Math.sin(a) * r * R * tilt;
            const x = cx + X * cphi - Y * sphi, y = cy + X * sphi + Y * cphi, s = hs[i] * R * 2.2;
            ctx.globalAlpha = 0.25;
            ctx.drawImage(HAZE[hc[i]], x - s / 2, y - s / 2, s, s);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';

        for (let i = 0; i < N; i++) {
            const r = pr[i], a = pa[i];
            const X = Math.cos(a) * r * R, Y = Math.sin(a) * r * R * tilt;
            const s = ps[i];
            ctx.fillStyle = pcol[i];
            ctx.fillRect(cx + X * cphi - Y * sphi - s / 2, cy + X * sphi + Y * cphi - s / 2, s, s);
        }

        ctx.globalCompositeOperation = 'lighter';
        drawGlow(cx, cy, R * 0.2, '255, 200, 140', 0.5);
        drawGlow(cx, cy, R * 0.08, '255, 255, 255', 0.95);
        ctx.globalCompositeOperation = 'source-over';

        ctx.lineWidth = 1.2;
        for (const s of STARS) {
            ctx.strokeStyle = 'rgba(' + s.color.join(',') + ',' + (s === hovered ? '0.4' : '0.15') + ')';
            ctx.beginPath();
            for (let k = 0; k <= 96; k++) {
                const t = k / 96 * TAU, X = Math.cos(t) * s.r * R, Y = Math.sin(t) * s.r * R * tilt;
                const x = cx + X * cphi - Y * sphi, y = cy + X * sphi + Y * cphi;
                if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        const fs = W < 640 ? 12 : 14;
        const pulse = reduceMotion ? 0 : Math.sin(clock * 2.2);
        HOME.sx = cx; HOME.sy = cy;
        for (const s of STARS) {
            const X = Math.cos(s.a) * s.r * R, Y = Math.sin(s.a) * s.r * R * tilt;
            s.sx = cx + X * cphi - Y * sphi; s.sy = cy + X * sphi + Y * cphi;
        }
        ctx.globalCompositeOperation = 'lighter';
        for (const s of STARS) {
            const on = s === hovered, rgb = s.color.join(',');
            const rad = (on ? 9 : 6.5) + pulse * 1;
            drawGlow(s.sx, s.sy, rad * 5.5, rgb, on ? 0.8 : 0.55);
            drawGlow(s.sx, s.sy, rad * 1.8, '255, 255, 255', 0.9);
        }
        ctx.globalCompositeOperation = 'source-over';

        ctx.textBaseline = 'middle';
        const items = STARS.concat([HOME]);
        for (const s of items) {
            const on = s === hovered, isHome = s === HOME;
            const text = s.label;
            ctx.font = isHome ? '400 ' + (fs + 10) + 'px "Instrument Serif", Georgia, serif' : '600 ' + fs + 'px "IBM Plex Sans", sans-serif';
            const tw = ctx.measureText(text).width;
            const padX = isHome ? 14 : 10, bh = isHome ? fs + 20 : fs + 12;
            let bw = tw + padX * 2, x, y;
            if (isHome) { x = s.sx - bw / 2; y = s.sy + R * 0.08; }
            else {
                const left = s.sx > W * 0.7;
                x = left ? s.sx - 16 - bw : s.sx + 16; y = s.sy - bh / 2;
            }
            s.lx = x; s.ly = y; s.lw = bw; s.lh = bh;
            ctx.fillStyle = on ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.94)';
            ctx.strokeStyle = on ? 'rgba(' + (isHome ? '200, 140, 50' : s.color.join(',')) + ', 1)' : 'rgba(' + (isHome ? '200, 180, 150' : s.color.join(',')) + ', 0.4)';
            ctx.lineWidth = on ? 2 : 1;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, bh / 2); else ctx.rect(x, y, bw, bh);
            ctx.shadowColor = on ? 'rgba(' + s.color.join(',') + ', 0.5)' : 'transparent';
            ctx.shadowBlur = on ? 12 : 0;
            ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.fillStyle = on ? '#1a2a4a' : '#2a3a5a';
            ctx.textAlign = 'left';
            ctx.fillText(text, x + padX, y + bh / 2 + (isHome ? 1 : 0.5));
        }

        if (hovered) {
            ctx.font = '400 ' + (fs - 1) + 'px "IBM Plex Sans", sans-serif';
            ctx.textAlign = 'left';
            const tw = ctx.measureText(hovered.desc).width;
            let x = hovered.lx, y = hovered.ly + hovered.lh + 14;
            if (x + tw > W - 10) x = W - 10 - tw;
            if (x < 10) x = 10;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
            ctx.strokeStyle = 'rgba(' + hovered.color.join(',') + ', 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x - 8, y - 11, tw + 16, 22, 6); else ctx.rect(x - 8, y - 11, tw + 16, 22);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#4a5a7a';
            ctx.fillText(hovered.desc, x, y);
        }
    }

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

    function hit(px, py) {
        let best = null, bd = Infinity;
        const items = STARS.concat([HOME]);
        for (const s of items) {
            const d = Math.hypot(px - s.sx, py - s.sy);
            const inLabel = px >= s.lx && px <= s.lx + s.lw && py >= s.ly && py <= s.ly + s.lh;
            const reach = s === HOME ? Math.max(24, R * 0.08) : 22;
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
