import { Waves } from './waves.js';
import { ChartBackground } from './chart-background.js';
import { mountWebsiteIcons } from './src/remotion/mountWebsiteIcons.jsx';
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

    // Initialize Remotion Motion Graphics Icons
    mountWebsiteIcons();

    // Initialize Scroll Journey
    initScrollJourney();
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', String(isExpanded));
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
});

// Scroll Header Effect
const navbar = document.querySelector('.navbar');
const isSubPage = Boolean(document.querySelector('.privacy-page, .not-found-page'));

window.addEventListener('scroll', () => {
    if (window.scrollY > 50 || isSubPage) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation (Excluding journey milestones to let the scroll ball activate them)
const revealElements = document.querySelectorAll('.feature-card:not(.journey-milestone), .service-item:not(.journey-milestone), .section-header, .contact-wrapper');

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

// ==========================================================================
// Scroll Journey Path Animation (Minimalist Overhaul)
// ==========================================================================
function initScrollJourney() {
    const journeyContainer = document.getElementById('journey-container');
    const scrollPathBg = document.getElementById('scroll-path-bg');
    const scrollPathActive = document.getElementById('scroll-path-active');
    const scrollBall = document.getElementById('scroll-ball');
    const heroLogo = document.getElementById('hero-logo-trigger');
    const milestones = document.querySelectorAll('.journey-milestone');

    if (!journeyContainer || !scrollPathBg || !scrollPathActive || !scrollBall || !heroLogo || milestones.length === 0) {
        return;
    }

    let points = [];
    let nodes = [];
    let pathLength = 0;
    let logoX = 0;
    let logoY = 0;
    let logoSize = 80;
    let containerAbsTop = 0;
    let pathEndY = 0;

    // Helper to get static offset top of an element (unaffected by CSS transforms)
    function getAbsoluteOffsetTop(element) {
        let top = 0;
        let el = element;
        while (el) {
            top += el.offsetTop;
            el = el.offsetParent;
        }
        return top;
    }

    // Helper to get static vertical offset for milestone nodes based on card type
    function getMilestoneOffset(milestone) {
        if (milestone.classList.contains('feature-card')) {
            const isMobile = window.innerWidth <= 768;
            return isMobile ? 125 : 130; // 30px (or 25px) padding + 100px (half of 200px wrapper height)
        }
        return milestone.offsetHeight / 2;
    }

    // Create indicator nodes dynamically
    const pathContainer = journeyContainer.querySelector('.scroll-path-container');
    milestones.forEach((_, i) => {
        const node = document.createElement('div');
        node.className = 'milestone-node';
        pathContainer.appendChild(node);
        nodes.push(node);
    });

    function updatePath() {
        const containerRect = journeyContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        containerAbsTop = getAbsoluteOffsetTop(journeyContainer);
        const isMobile = window.innerWidth <= 768;

        points = [];

        // 1. Start Point (centered or left on mobile)
        const startX = isMobile ? 20 : containerWidth / 2;
        points.push([startX, 0]);

        // 2. Map Milestones using static offset tops
        milestones.forEach((milestone) => {
            const absTop = getAbsoluteOffsetTop(milestone);
            const y = absTop - containerAbsTop + getMilestoneOffset(milestone);
            const side = milestone.getAttribute('data-side');

            let x = startX; // default (mobile or center)
            if (!isMobile) {
                if (side === 'left') {
                    x = containerWidth / 2 - 50;
                } else if (side === 'right') {
                    x = containerWidth / 2 + 50;
                } else {
                    x = containerWidth / 2;
                }
            }
            points.push([x, y]);
        });

        // Build SVG path string using cubic Beziers
        let d = `M ${points[0][0]} ${points[0][1]}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const dy = curr[1] - prev[1];

            if (isMobile) {
                d += ` L ${curr[0]} ${curr[1]}`;
            } else {
                d += ` C ${prev[0]} ${prev[1] + dy * 0.45}, ${curr[0]} ${curr[1] - dy * 0.45}, ${curr[0]} ${curr[1]}`;
            }

            // Position milestone nodes (excluding start point)
            const node = nodes[i - 1];
            if (node) {
                node.style.left = `${curr[0]}px`;
                node.style.top = `${curr[1]}px`;
            }
        }

        scrollPathBg.setAttribute('d', d);
        scrollPathActive.setAttribute('d', d);

        // Y of the last node — upper bound for the ball's Y-anchored mapping
        pathEndY = points[points.length - 1][1];

        // Update active stroke parameters
        pathLength = scrollPathActive.getTotalLength();
        scrollPathActive.style.strokeDasharray = pathLength;
        scrollPathActive.style.strokeDashoffset = pathLength;

        // Calculate static logo position to avoid bounding rect calls in scroll frames
        const logoRect = heroLogo.getBoundingClientRect();
        logoX = logoRect.left - containerRect.left + logoRect.width / 2;
        logoY = logoRect.top - containerRect.top + logoRect.height / 2;
        logoSize = logoRect.width;
    }

    function animate() {
        if (!journeyContainer) return;

        const heroHeight = window.innerHeight;
        const scrollY = window.scrollY;

        // Transition morph range
        const transitionZone = heroHeight * 0.7;
        const t = Math.max(0, Math.min(1, scrollY / transitionZone));
        const ease = t * t * (3 - 2 * t);

        // Y-anchored ball target: the path point whose Y matches the viewport center
        // (container coordinates). Nodes sit at their card-center Y, so this makes the
        // ball land exactly on a node when its card is centered — no arc-length drift.
        // Shared by both phases so the morph→rolling hand-off stays continuous.
        const viewportCenterY = scrollY + heroHeight / 2;
        const targetY = Math.max(0, Math.min(pathEndY, viewportCenterY - containerAbsTop));
        let lo = 0;
        let hi = pathLength;
        for (let i = 0; i < 18; i++) {
            const mid = (lo + hi) / 2;
            if (scrollPathActive.getPointAtLength(mid).y < targetY) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        const currentLength = (lo + hi) / 2;
        const point = scrollPathActive.getPointAtLength(currentLength);

        if (t < 1) {
            // Morph phase: ball starts as large hollow ring on hero logo
            const size = logoSize - (logoSize - 18) * ease;
            const x = logoX + (point.x - logoX) * ease;
            const y = logoY + (point.y - logoY) * ease;

            scrollBall.style.width = `${size}px`;
            scrollBall.style.height = `${size}px`;
            scrollBall.style.left = `${x}px`;
            scrollBall.style.top = `${y}px`;

            // Slowly fade out the logo as scrolling starts
            const logoOpacity = Math.max(0, 1 - t * 1.5);
            heroLogo.style.opacity = logoOpacity;

            // Ball gains opacity as you scroll down to the first point
            scrollBall.style.opacity = ease;
            scrollBall.style.background = 'radial-gradient(circle, #ff8c00 0%, var(--accent-color) 70%, #d45d00 100%)';
            scrollBall.style.border = 'none';
            scrollBall.style.boxShadow = `0 0 15px var(--accent-color), 0 0 ${30 * ease}px var(--accent-glow)`;

            // Draw the trail in sync with the ball as it descends (grows with ease,
            // so it stays empty at the very start and matches the rolling phase at t→1).
            scrollPathActive.style.strokeDashoffset = pathLength - currentLength * ease;

            // Reset nodes
            milestones.forEach((m, idx) => {
                m.classList.remove('active');
                if (nodes[idx]) nodes[idx].classList.remove('active');
            });
        } else {
            // Path rolling phase
            heroLogo.style.opacity = 0; // Ensure logo is fully hidden

            // Snap only the horizontal wiggle onto a node when vertically aligned.
            let snappedX = point.x;
            let snappedY = point.y;
            points.slice(1).forEach((pt) => {
                if (Math.abs(point.y - pt[1]) < 8) {
                    snappedX = pt[0];
                }
            });

            scrollBall.style.width = '18px';
            scrollBall.style.height = '18px';
            scrollBall.style.left = `${snappedX}px`;
            scrollBall.style.top = `${snappedY}px`;
            scrollBall.style.opacity = '1';
            scrollBall.style.background = 'radial-gradient(circle, #ff8c00 0%, var(--accent-color) 70%, #d45d00 100%)';
            scrollBall.style.border = 'none';
            scrollBall.style.boxShadow = '0 0 15px var(--accent-color), 0 0 30px var(--accent-glow)';

            scrollPathActive.style.strokeDashoffset = pathLength - currentLength;

            // Activate elements on proximity
            milestones.forEach((milestone, idx) => {
                const node = nodes[idx];
                const milestoneY = points[idx + 1][1];

                // The card starts to reveal and animate as the ball approaches
                if (point.y >= milestoneY - 100) {
                    milestone.classList.add('active');
                } else {
                    milestone.classList.remove('active');
                }

                // The milestone node (grey circle on path) only turns orange/active when the ball reaches or passes it
                if (point.y >= milestoneY - 5) {
                    if (node) node.classList.add('active');
                } else {
                    if (node) node.classList.remove('active');
                }
            });
        }

        requestAnimationFrame(animate);
    }

    // Interactive Card Tilt & spotlight glow effect
    const interactiveCards = document.querySelectorAll('.feature-card, .service-item');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const dx = x - xc;
            const dy = y - yc;
            
            // Dynamic 3D tilt calculation
            const tiltX = -(dy / yc) * 5;
            const tiltY = (dx / xc) * 5;
            
            card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.setProperty('--x', `50%`);
            card.style.setProperty('--y', `50%`);
        });
    });

    // Scroll Snapping Behavior to center cards optimally in the viewport
    let isSnapping = false;
    let snapTimeout = null;

    function attemptSnap() {
        if (isSnapping || window.innerWidth <= 768) return; // Don't snap on mobile to keep simple scrolling

        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;
        const transitionZone = heroHeight * 0.7;

        if (scrollY < transitionZone) return; // Don't snap in the Hero section

        const viewportCenter = scrollY + window.innerHeight / 2;
        let closestMilestone = null;
        let minDistance = Infinity;
        let targetScrollY = 0;

        milestones.forEach((milestone) => {
            const absTop = getAbsoluteOffsetTop(milestone);
            // Calculate absolute vertical center of the milestone card/item using static layout values
            const milestoneCenterY = absTop + getMilestoneOffset(milestone);
            const distance = Math.abs(viewportCenter - milestoneCenterY);

            if (distance < minDistance) {
                minDistance = distance;
                closestMilestone = milestone;
                // Scroll target that places the center of this milestone exactly at the center of the viewport
                targetScrollY = milestoneCenterY - window.innerHeight / 2;
            }
        });

        // Snap threshold: snap if milestone center is within 120px of viewport center and not already snapped
        const snapThreshold = 120;
        if (closestMilestone && minDistance < snapThreshold && minDistance > 5) {
            isSnapping = true;
            window.scrollTo({
                top: targetScrollY,
                behavior: 'smooth'
            });

            // Unlock scroll listening after smooth scroll finishes (approx 700ms)
            setTimeout(() => {
                isSnapping = false;
            }, 700);
        }
    }

    // Scroll listener with debounce to snap when scroll stops
    window.addEventListener('scroll', () => {
        if (isSnapping) return;
        clearTimeout(snapTimeout);
        snapTimeout = setTimeout(attemptSnap, 300);
    });

    // Delay start slightly to let layout solve scroll dimensions
    setTimeout(() => {
        updatePath();
        animate();
    }, 100);

    window.addEventListener('resize', updatePath);
}
