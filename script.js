import { Waves } from './waves.js';
import { ChartBackground } from './chart-background.js';
import logoLightUrl from './logo.png';
import logoDarkUrl from './logo-dark.png';

// Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const logoImg = document.querySelector('.logo img');
const body = document.body;

// Check saved theme or system preference
const savedTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
const initialTheme = savedTheme || systemTheme;

// Apply initial theme
body.setAttribute('data-theme', initialTheme);
updateIcons(initialTheme);

function updateIcons(theme) {
    if (theme === 'light') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        if (logoImg) logoImg.src = logoDarkUrl;
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        if (logoImg) logoImg.src = logoLightUrl;
    }
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcons(newTheme);
    });
}

// Initialize Visuals
document.addEventListener('DOMContentLoaded', () => {
    // Waves (Hero)
    if (document.getElementById('waves-container')) {
        new Waves('#waves-container', {
            strokeColor: '#334155',
        });
    }

    // Chart (Services/Section 3)
    if (document.getElementById('chart-container')) {
        new ChartBackground('#chart-container', {
            strokeColor: '#FF6B00',
            fillStart: 'rgba(255, 107, 0, 0.15)',
            fillEnd: 'rgba(255, 107, 0, 0.0)',
            gridColor: 'rgba(255, 255, 255, 0.03)'
        });
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Scroll Header Effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.feature-card, .service-item, .section-header, .contact-wrapper');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('reveal', 'active');
        } else {
            // Optional: Remove class to re-animate when scrolling up
            // element.classList.remove('reveal', 'active');
        }

        // Add initial reveal class if not present
        if (!element.classList.contains('reveal')) {
            element.classList.add('reveal');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Trigger once on load
revealOnScroll();

// Loading Screen
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    // Minimum load time of 1 second to show off the animation
    setTimeout(() => {
        if (loader) {
            loader.classList.add('loaded');
        }
        // Enable scrolling or other initializations if needed
    }, 1000);
});

// Form Submission (Formspree)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;

        // Validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        submitBtn.disabled = true;
        submitBtn.innerText = 'Enviando...';

        try {
            // Using FormSubmit.co
            // Endpoint: spoderick999@gmail.com (Main Receiver "For Now")
            // CC: contactors@ibkan.com.mx
            const response = await fetch('https://formsubmit.co/spoderick999@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _cc: 'contactors@ibkan.com.mx',
                    _subject: 'Nuevo contacto desde Solutera Web',
                    _template: 'table',
                    _captcha: 'false'
                })
            });

            if (response.ok) {
                // Show Success Modal
                const modal = document.getElementById('success-modal');
                if (modal) {
                    modal.classList.add('active');

                    // Close handler
                    const closeBtn = document.getElementById('close-modal-btn');
                    const closeFn = () => {
                        modal.classList.remove('active');
                    };

                    if (closeBtn) closeBtn.onclick = closeFn;

                    // Close on outside click
                    modal.onclick = (e) => {
                        if (e.target === modal) closeFn();
                    };
                } else {
                    alert('¡Gracias! Tu mensaje ha sido enviado.');
                }

                contactForm.reset();
            } else {
                // FormSubmit usually returns 200 OK even for errors if simple HTML, but for JSON it might return 4xx/5xx
                // or a success: false
                const data = await response.json().catch(() => ({}));
                console.error('Submission Error:', data);
                alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error de conexión al enviar el mensaje.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
    });
}
