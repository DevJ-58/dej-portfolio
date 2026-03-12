// ==========================================
// PORTFOLIO DEVJ - SCRIPT.JS
// JavaScript optimisé avec Lenis & GSAP
// ==========================================

// ==========================================
// INITIALISATION LENIS (SMOOTH SCROLL)
// ==========================================
let lenis;

function initLenis() {
    lenis = new Lenis({
        duration: 0.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 1,
        infinite: false,
        lerp: 1,
        wheelMultiplier: 1,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Mise à jour de la barre de progression
    lenis.on('scroll', ({ scroll, limit }) => {
        const progress = (scroll / limit) * 100;
        const progressBar = document.getElementById('scrollProgress');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    });

    // Intégration avec ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);
}

// ==========================================
// METHODOLOGY INNER SCROLL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les cartes de compétences avec pourcentage
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const progress = card.querySelector('.skill-progress')?.getAttribute('data-progress') || '0';
        card.setAttribute('data-progress', progress);
    });
    
    const methodologyRight = document.querySelector('.methodology-right');
    
    if (methodologyRight) {
        // Empêcher Lenis de scroller la page quand on scroll dans methodology-right
        methodologyRight.addEventListener('wheel', (e) => {
            const scrollTop = methodologyRight.scrollTop;
            const scrollHeight = methodologyRight.scrollHeight;
            const clientHeight = methodologyRight.clientHeight;
            
            // Si on est en haut et on scrolle vers le haut, laisser Lenis prendre le contrôle
            if (scrollTop === 0 && e.deltaY < 0) {
                return; // Laisser Lenis prendre le contrôle
            }
            
            // Si on est en bas et on scrolle vers le bas, laisser Lenis prendre le contrôle
            if (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0) {
                return; // Laisser Lenis prendre le contrôle
            }
            
            // Sinon, consommer l'event et scroller en interne
            e.preventDefault();
            methodologyRight.scrollTop += e.deltaY;
        }, { passive: false });
        
        // Aussi gérer le trackpad/scroll lisse
        let isScrollingMethodology = false;
        
        methodologyRight.addEventListener('mouseenter', () => {
            isScrollingMethodology = true;
            if (lenis) lenis.stop();
        });
        
        methodologyRight.addEventListener('mouseleave', () => {
            isScrollingMethodology = false;
            if (lenis) lenis.start();
        });
    }
});

// ==========================================
// PRELOADER
// ==========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                initAllAnimations();
            }, 500);
        }
    }, 1500);
});

// ==========================================
// PARTICLES CANVAS
// ==========================================
const canvas = document.getElementById('particles');
if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 80;
    const connectionDistance = isMobile ? 100 : 150;
    const particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            const theme = document.body.getAttribute('data-theme');
            const color = theme === 'light' ? 'rgba(5, 150, 105, 0.3)' : 'rgba(16, 185, 129, 0.3)';
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        if (!isMobile) {
            const theme = document.body.getAttribute('data-theme');
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.15;
                        const color = theme === 'light' 
                            ? `rgba(5, 150, 105, ${opacity})` 
                            : `rgba(16, 185, 129, ${opacity})`;
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// ==========================================
// NAVIGATION
// ==========================================
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const menuOverlay = document.querySelector('.menu-overlay') || createMenuOverlay();

function createMenuOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    return overlay;
}

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Burger menu
if (burger) {
    burger.addEventListener('click', () => {
        const isActive = burger.classList.contains('active');
        
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        if (!isActive) {
            lenis.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenis.start();
            document.body.style.overflow = '';
        }
    });
}

// Menu overlay click
if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
}

function closeMenu() {
    burger.classList.remove('active');
    navLinks.classList.remove('active');
    menuOverlay.classList.remove('active');
    lenis.start();
    document.body.style.overflow = '';
}

// Navigation links
navLinkItems.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active from all
        navLinkItems.forEach(l => l.classList.remove('active'));
        
        // Add active to clicked
        link.classList.add('active');
        
        // Close menu
        closeMenu();
        
        // Smooth scroll to section
        const target = document.querySelector(link.getAttribute('href'));
        if (target && lenis) {
            lenis.scrollTo(target, {
                offset: -80,
                duration: 1.5,
            });
        }
    });
});

// Active section on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavOnScroll() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinkItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavOnScroll);

// ==========================================
// THEME TOGGLE (MODE JOUR/NUIT)
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const body = document.body;

// Charger le thème sauvegardé
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ==========================================
// TYPED TEXT EFFECT
// ==========================================
const typedTextSpan = document.querySelector('.typed-text');
const textArray = [
    'Développeur Frontend',
    'Créateur Numérique',
    'Future Ingénieur IA',
    'Tech Enthusiast'
];
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (typedTextSpan && charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    if (typedTextSpan && charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(type, 600);
    }
}

// Démarrer le typing après le preloader
setTimeout(() => {
    if (typedTextSpan) type();
}, 2000);

// ==========================================
// STATS COUNTER
// ==========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (target === 100 ? '%' : '+');
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(start) + (target === 100 ? '%' : '+');
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-item strong').forEach(stat => {
                const targetValue = parseInt(stat.getAttribute('data-target'));
                if (!isNaN(targetValue)) {
                    animateCounter(stat, targetValue);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ==========================================
// SKILL BARS ANIMATION
// ==========================================
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            skillsAnimated = true;
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress + '%';
                }, index * 100);
            });
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ==========================================
// FAQ ACCORDION
// ==========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
        question.addEventListener('click', () => {
            // Fermer les autres items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle l'item cliqué
            item.classList.toggle('active');
        });
    }
});

// ==========================================
// CONTACT FORM
// ==========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        const whatsappMessage = encodeURIComponent(
            `Bonjour DevJ!\n\n` +
            `Nom: ${name}\n` +
            `Email: ${email}\n` +
            `Sujet: ${subject}\n\n` +
            `Message:\n${message}`
        );
        
        window.open(`https://wa.me/2250767998373?text=${whatsappMessage}`, '_blank');
        contactForm.reset();
    });
}

// ==========================================
// SCROLL TO TOP
// ==========================================
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        if (lenis) {
            lenis.scrollTo('top', { duration: 2 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ==========================================
// GSAP ANIMATIONS
// ==========================================
function initAllAnimations() {
    // Hero animations
    gsap.from('.hero-content > *', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3
    });
    
    gsap.from('.hero-image', {
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5
    });
    
    // Parallax sur desktop uniquement
    if (window.innerWidth > 768) {
        gsap.to('.hero-image', {
            y: 200,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });
        
        gsap.to('.tech-circle', {
            rotation: 360,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 2
            }
        });
        
        gsap.to('.float-icon', {
            y: -100,
            rotation: 20,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
    
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.children, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
                trigger: header,
                start: 'top 80%'
            }
        });
    });
    
    // Skill cards
    gsap.utils.toArray('.skill-card').forEach(card => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            }
        });
    });
    
    // Project cards
    gsap.utils.toArray('.project-card').forEach(card => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            }
        });
    });
    
    // Service cards
    gsap.utils.toArray('.service-card').forEach(card => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            }
        });
    });
    
    // Methodology steps
    gsap.utils.toArray('.methodology-step').forEach(step => {
        gsap.from(step, {
            x: -50,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: step,
                start: 'top 85%'
            }
        });
    });
    
    // FAQ items
    gsap.utils.toArray('.faq-item').forEach(item => {
        gsap.from(item, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: item,
                start: 'top 90%'
            }
        });
    });
    
    // Contact section
    if (window.innerWidth > 768) {
        gsap.from('.contact-form', {
            x: 100,
            opacity: 0,
            scrollTrigger: {
                trigger: '.contact-container',
                start: 'top 80%'
            }
        });
        
        gsap.from('.contact-info', {
            x: -100,
            opacity: 0,
            scrollTrigger: {
                trigger: '.contact-container',
                start: 'top 80%'
            }
        });

        // Setup shared hero -> about image transition
        setupSharedImageTransition();
    }
}

// ==========================================
// MAGNETIC BUTTONS (Desktop only)
// ==========================================
if (window.innerWidth > 768) {
    document.querySelectorAll('.btn, .social-icon, .social-link').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// ==========================================
// SMOOTH LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target && lenis) {
            lenis.scrollTo(target, {
                offset: -80,
                duration: 1.5
            });
        }
    });
});

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K → Aller au contact
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo('#contact', { offset: -80 });
        }
        setTimeout(() => {
            const nameInput = document.getElementById('name');
            if (nameInput) nameInput.focus();
        }, 1000);
    }
    
    // Escape → Fermer le menu
    if (e.key === 'Escape') {
        closeMenu();
    }
});

// ==========================================
// COPY EMAIL
// ==========================================
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.href.replace('mailto:', '');
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email copié dans le presse-papier !');
            });
        }
    });
});

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--accent-gradient);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: var(--shadow-lg);
        animation: fadeInOut 2s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// ==========================================
// RESIZE HANDLER
// ==========================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 300);
});

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    
    // Smooth page appearance
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// ==========================================
// CUSTOM CURSOR (Desktop only)
// ==========================================
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--accent-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Agrandir le curseur sur les éléments interactifs
    document.querySelectorAll('a, button, .btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
        });
    });
}

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c👋 Salut ! Bienvenue sur mon portfolio', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%cDéveloppé avec ❤️ par DevJ', 'color: #10b981; font-size: 14px;');
console.log('%cSi vous voyez des bugs, contactez-moi : devfred58@gmail.com', 'color: #a0a0a0; font-size: 12px;');

// ==========================================
// SHARED IMAGE TRANSITION
// ==========================================
function setupSharedImageTransition() {
    const heroImg = document.getElementById('heroImg');
    const aboutImg = document.getElementById('aboutImg');
    const aboutWrapper = document.querySelector('.about-image-wrapper');

    if (!heroImg || !aboutWrapper || !aboutImg || !gsap || !ScrollTrigger) return;

    let activeClone = null;

    function animateHeroToAbout() {
        const rectHero = heroImg.getBoundingClientRect();
        const rectTarget = aboutWrapper.getBoundingClientRect();

        const clone = heroImg.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.top = (rectHero.top + window.scrollY) + 'px';
        clone.style.left = (rectHero.left + window.scrollX) + 'px';
        clone.style.width = rectHero.width + 'px';
        clone.style.height = rectHero.height + 'px';
        clone.style.margin = '0';
        clone.style.zIndex = 9999;
        clone.style.pointerEvents = 'none';
        clone.style.borderRadius = window.getComputedStyle(heroImg).borderRadius || '12px';
        document.body.appendChild(clone);
        activeClone = clone;

        gsap.to(clone, {
            duration: 1,
            top: rectTarget.top + window.scrollY,
            left: rectTarget.left + window.scrollX,
            width: rectTarget.width,
            height: rectTarget.height,
            ease: 'power3.inOut',
            onComplete: () => {
                if (heroImg.src) aboutImg.src = heroImg.src;
                if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
                activeClone = null;
            }
        });
    }

    function animateBack() {
        if (activeClone) return;
        if (!aboutImg.src) return;

        const rectHero = heroImg.getBoundingClientRect();
        const rectTarget = aboutWrapper.getBoundingClientRect();

        const clone = aboutImg.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.top = (rectTarget.top + window.scrollY) + 'px';
        clone.style.left = (rectTarget.left + window.scrollX) + 'px';
        clone.style.width = rectTarget.width + 'px';
        clone.style.height = rectTarget.height + 'px';
        clone.style.margin = '0';
        clone.style.zIndex = 9999;
        clone.style.pointerEvents = 'none';
        document.body.appendChild(clone);

        gsap.to(clone, {
            duration: 0.9,
            top: rectHero.top + window.scrollY,
            left: rectHero.left + window.scrollX,
            width: rectHero.width,
            height: rectHero.height,
            ease: 'power3.inOut',
            onComplete: () => {
                aboutImg.removeAttribute('src');
                if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
            }
        });
    }

    ScrollTrigger.create({
        trigger: '.about',
        start: 'top 60%',
        end: 'bottom 20%',
        onEnter: () => animateHeroToAbout(),
        onEnterBack: () => animateHeroToAbout(),
        onLeaveBack: () => animateBack()
    });
}