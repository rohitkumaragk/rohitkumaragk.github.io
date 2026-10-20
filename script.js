// ========== THEME TOGGLE ==========
// Initial theme is applied by a tiny inline script in <head> (saved choice, else system preference).
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}
updateThemeIcon(root.getAttribute('data-theme') || 'dark');

themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: ignore */ }
    updateThemeIcon(next);
});

// ========== MOBILE MENU ==========
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function setMenu(open) {
    mobileMenu.classList.toggle('active', open);
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
    mobileMenuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenuBtn.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
}
mobileMenuBtn.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('active')));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ========== SCROLL: NAVBAR, PROGRESS BAR, BACK-TO-TOP, ACTIVE LINK ==========
const navbar = document.querySelector('.navbar');
const backToTop = document.getElementById('backToTop');
const progressBar = document.getElementById('progressBar');
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-link'));

let ticking = false;
function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 80);
    backToTop.classList.toggle('visible', y > 500);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';

    let current = '';
    sections.forEach(s => { if (y >= s.offsetTop - 140) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    ticking = false;
}
window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ========== TYPED TEXT ==========
const typedTextSpan = document.querySelector('.typed-text');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const textArray = [
    'Astrophysics Researcher',
    'AGN & Black Hole Physicist',
    'M.Sc. @ Ariel University',
    'NIT Hamirpur Alumnus',
    'Science Communicator',
    'From Bihar to the Cosmos'
];
let textIndex = 0, charIndex = 0;

function type() {
    const text = textArray[textIndex];
    if (charIndex < text.length) {
        typedTextSpan.textContent = text.slice(0, ++charIndex);
        setTimeout(type, 90);
    } else {
        setTimeout(erase, 2000);
    }
}
function erase() {
    const text = textArray[textIndex];
    if (charIndex > 0) {
        typedTextSpan.textContent = text.slice(0, --charIndex);
        setTimeout(erase, 45);
    } else {
        textIndex = (textIndex + 1) % textArray.length;
        setTimeout(type, 500);
    }
}
if (typedTextSpan) {
    if (reduceMotion) typedTextSpan.textContent = textArray[0];
    else setTimeout(type, 600);
}

// ========== REVEAL ON SCROLL ==========
const revealEls = document.querySelectorAll(
    '.section-title, .about-text, .about-stats, .timeline-item, .abstract-figure, .research-card, .project-card, ' +
    '.talk-card, .pub-list, .cert-card, .skill-category, .teaching-card, .blog-preview, .contact-container'
);
revealEls.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('in'));
}

// ========== POSTER LINK: show only if the PDF exists in the repo ==========
const posterLink = document.getElementById('posterLink');
if (posterLink) {
    fetch(posterLink.getAttribute('href'), { method: 'HEAD' })
        .then(r => { if (r.ok) posterLink.hidden = false; })
        .catch(() => { /* file not uploaded yet: keep hidden */ });
}

// ========== FOOTER YEAR ==========
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ========== STARFIELD BACKGROUND (lightweight canvas, replaces particles.js) ==========
(function starfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, stars = [], raf = null;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.round(Math.min(160, (w * h) / 9000));
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.3 + 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.015 + 0.004,
            drift: Math.random() * 0.06 + 0.01
        }));
    }

    function draw(t) {
        ctx.clearRect(0, 0, w, h);
        const dark = root.getAttribute('data-theme') !== 'light';
        const base = dark ? '255,255,255' : '29,95,209';
        const peak = dark ? 0.85 : 0.35;
        for (const s of stars) {
            const a = (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed * 0.06))) * peak;
            ctx.beginPath();
            ctx.fillStyle = 'rgba(' + base + ',' + a.toFixed(3) + ')';
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            if (!reduceMotion) {
                s.y -= s.drift;
                if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
            }
        }
        if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    resize();
    draw(0);
    window.addEventListener('resize', () => { resize(); if (reduceMotion) draw(0); });
    document.addEventListener('visibilitychange', () => {
        if (reduceMotion) return;
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(draw);
    });
    // Redraw static frame when theme changes in reduced-motion mode
    themeToggle.addEventListener('click', () => { if (reduceMotion) draw(0); });
})();
