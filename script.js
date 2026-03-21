// Particles.js Configuration
particlesJS("particles-js", {
    particles: {
        number: {
            value: 55,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ["#0f3b6f", "#1e5a9c"]
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.4,
            random: true
        },
        size: {
            value: 2,
            random: true
        },
        line_linked: {
            enable: false
        },
        move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out"
        }
    },
    interactivity: {
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            }
        }
    }
});

// Typing Animation
const typedEl = document.querySelector('.typed-text');
const texts = ["Astrophysics Researcher", "AGN & Black Hole Specialist", "M.Sc. Physics @ Ariel University"];
let idx = 0, charIdx = 0, isDeleting = false;

function typeEffect() {
    const current = texts[idx];
    if (isDeleting) {
        typedEl.innerText = current.substring(0, charIdx--);
    } else {
        typedEl.innerText = current.substring(0, charIdx++);
    }
    
    if (!isDeleting && charIdx === current.length + 1) {
        isDeleting = true;
    }
    
    if (isDeleting && charIdx === 0) {
        isDeleting = false;
        idx = (idx + 1) % texts.length;
    }
    
    setTimeout(typeEffect, isDeleting ? 60 : 120);
}
typeEffect();

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

if (localStorage.getItem('theme') === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.onclick = () => {
    if (root.getAttribute('data-theme') === 'dark') {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
};

// Progress Bar & Scroll Effects
window.addEventListener('scroll', () => {
    const progressBar = document.getElementById('progressBar');
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrollPercent + '%';
    
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Back to Top Button
document.getElementById('backToTop').onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.onclick = () => {
    mobileMenu.classList.toggle('active');
};

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link, .mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Active link highlighting on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Current Year for Footer
document.getElementById('currentYear').innerText = new Date().getFullYear();
