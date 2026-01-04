// --- Particle Effect ---
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.speed = 0.5 + Math.random() * 1;
        this.radius = Math.random() * 2;
        this.opacity = 0.1 + Math.random() * 0.4;
    }

    update() {
        this.y -= this.speed;
        if (this.y < -10) {
            this.y = height + Math.random() * 20;
            this.x = Math.random() * width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    resize();
    initParticles();
});
resize();
initParticles();
animateParticles();

// --- Custom Cursor ---
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

window.addEventListener('mousemove', function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Animate outline with a slight delay
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Cursor Hover Effect
const hoverElements = document.querySelectorAll('a, button, .project-card, input, textarea');

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
    });
});


// --- Parallax & Tilt Effect (Header) ---
const tiltCard = document.getElementById('tiltCard');
const heroText = document.getElementById('heroText');

document.addEventListener('mousemove', (e) => {
    // Only apply heavy parallax on large screens to avoid performance issues on mobile
    if (window.innerWidth > 900) {
        const x = (window.innerWidth / 2 - e.pageX) / 25;
        const y = (window.innerHeight / 2 - e.pageY) / 25;

        // Tilt the card
        if (tiltCard) {
            tiltCard.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
        }

        // Parallax text
        if (heroText) {
            heroText.style.transform = `translateX(${x / 2}px) translateY(${y / 2}px)`;
        }
    }
});


// --- Magnetic Button Effect (Reusable) ---
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(wrapper => {
    const btn = wrapper.querySelector('a') || wrapper.querySelector('button');
    const strength = wrapper.getAttribute('data-strength') || 30;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
    });

    wrapper.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});


// --- Smooth Scrolling for Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset for sticky header
                behavior: 'smooth'
            });
        }
    });
});

// --- Experience Card Hover 3D Effect (Subtle) ---
const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Very subtle tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});


// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: Stop observing once revealed
            // observer.unobserve(entry.target); 
        }
    });
}, {
    root: null,
    threshold: 0.15, // Trigger when 15% visible
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));


// --- EmailJS Contact Form Handling ---
const contactForm = document.getElementById('contact-form');
const notification = document.getElementById('notification');
const submitBtn = contactForm.querySelector('.submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

function showNotification(type, title, message) {
    notification.className = `notification-toast ${type} show`;
    notification.querySelector('ion-icon').name = type === 'success' ? 'checkmark-circle' : 'alert-circle';
    notification.querySelector('h4').textContent = title;
    notification.querySelector('p').textContent = message;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show Loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    btnLoading.style.alignItems = 'center';
    btnLoading.style.gap = '8px';
    submitBtn.disabled = true;

    // Send via EmailJS
    // NOTE: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual EmailJS IDs
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
        .then(() => {
            showNotification('success', 'Berhasil!', 'Pesan Anda telah terkirim.');
            contactForm.reset();
        }, (error) => {
            console.error('EmailJS Error:', error);
            showNotification('error', 'Gagal', 'Terjadi kesalahan. Silakan coba lagi.');
        })
        .finally(() => {
            // Restore Button
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        });
});
