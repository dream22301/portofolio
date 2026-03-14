'use strict';

/* ---------- Typed Text Effect ---------- */
const roles = [
    'Membuat Web.',
    'Menggunakan API.',
    'Membuat Game.',
    'Menggunakan Github.',
    'Menggunakan MYSQL.',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
    if (!typedEl) return;
    const current = roles[roleIndex];

    if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 50 : 80;

    if (!isDeleting && charIndex === current.length) {
        delay = 2000; // pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
    }

    setTimeout(type, delay);
}

/* ---------- Navbar Scroll Behavior ---------- */
const navbar = document.getElementById('navbar');

function onScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    highlightNavLink();
    toggleBackToTop();
}

/* ---------- Active Nav Link on Scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ---------- Hamburger Menu ---------- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

function toggleMenu() {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', toggleMenu);

// Close on link click
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close on outside click (mobile)
document.addEventListener('click', (e) => {
    if (
        navLinksEl.classList.contains('open') &&
        !navLinksEl.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        closeMenu();
    }
});

/* ---------- Scroll Reveal (IntersectionObserver) ---------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay for sibling elements
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
                const idx = siblings.indexOf(entry.target);
                const delay = Math.min(idx * 80, 400);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Skills Filter ---------- */
const catBtns = document.querySelectorAll('.skill-cat-btn');
const skillCards = document.querySelectorAll('.skill-card');

catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.cat;

        skillCards.forEach(card => {
            const cardCat = card.dataset.cat;
            if (cat === 'all' || cardCat === cat) {
                card.classList.remove('hidden');
                // Re-trigger reveal if not yet visible
                if (!card.classList.contains('visible')) {
                    card.classList.add('visible');
                }
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ---------- Skill Bar Animation ---------- */
// Trigger fill when skill card becomes visible
const skillObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // triggers CSS var(--fill)
                skillObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.3 }
);

skillCards.forEach(card => skillObserver.observe(card));

/* ---------- Back to Top ---------- */
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
    if (window.scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Contact Form ---------- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

function validateField(id, errorId, rule) {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);

    if (!rule(input.value.trim())) {
        input.classList.add('error');
        return false;
    }
    input.classList.remove('error');
    error.textContent = '';
    return true;
}

function setError(id, errorId, msg) {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    input.classList.add('error');
    error.textContent = msg;
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    // Name
    const nameVal = document.getElementById('name').value.trim();
    if (!nameVal) {
        setError('name', 'nameError', 'Name is required.');
        valid = false;
    } else {
        document.getElementById('name').classList.remove('error');
        document.getElementById('nameError').textContent = '';
    }

    // Email
    const emailVal = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
        setError('email', 'emailError', 'Email is required.');
        valid = false;
    } else if (!emailRegex.test(emailVal)) {
        setError('email', 'emailError', 'Please enter a valid email.');
        valid = false;
    } else {
        document.getElementById('email').classList.remove('error');
        document.getElementById('emailError').textContent = '';
    }

    // Message
    const msgVal = document.getElementById('message').value.trim();
    if (!msgVal) {
        setError('message', 'messageError', 'Message is required.');
        valid = false;
    } else {
        document.getElementById('message').classList.remove('error');
        document.getElementById('messageError').textContent = '';
    }

    if (!valid) return;

    submitBtn.disabled = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim() || "Portfolio Contact";
    const message = document.getElementById('message').value.trim();

    const gmailURL =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        "&to=brilliantprincoekananda2009@gmail.com" +
        "&su=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(
            "Name: " + name + "\n" +
            "Email: " + email + "\n\n" +
            message
        );

    window.open(gmailURL, "_blank");

    contactForm.reset();
    formSuccess.classList.add('show');
    submitBtn.disabled = false;
    });

/* Loader spin keyframe injection */
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(spinStyle);

/* ---------- Download CV Placeholder ---------- */
document.getElementById('downloadCv')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('CV download will be available soon! Please reach out via the contact form.');
});

/* ---------- Init ---------- */
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load
type();     // start typed effect
