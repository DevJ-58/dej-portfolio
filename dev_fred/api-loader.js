// ============================================
// PORTFOLIO DEVJ - Chargement dynamique API
// ============================================

// ⚠️ IMPORTANT: Remplace cette URL par ton URL Railway une fois déployé
// En local, utilise: 'http://localhost/portfolio-devj/admin/api/index.php'
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/admin/api/index.php'
    : 'https://TON-URL-RAILWAY.up.railway.app/admin/api/index.php';

// Fallback: si l'API ne répond pas, le contenu HTML statique reste affiché
async function apiGet(section) {
    try {
        const res = await fetch(API_BASE + '?section=' + section);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        return data.success ? data.data : null;
    } catch (e) {
        console.warn('[DevJ API] Section "' + section + '" non chargée:', e.message);
        return null;
    }
}

// ============================================
// THEME — Injecte les CSS variables dynamiques
// ============================================
async function loadTheme() {
    const t = await apiGet('theme');
    if (!t) return;
    const root = document.documentElement;
    if (t.couleur_primaire)    root.style.setProperty('--primary', t.couleur_primaire);
    if (t.couleur_secondaire)  root.style.setProperty('--secondary', t.couleur_secondaire);
    if (t.couleur_accent)      root.style.setProperty('--accent', t.couleur_accent);
    if (t.couleur_fond_dark)   root.style.setProperty('--bg-dark', t.couleur_fond_dark);
    if (t.couleur_fond_light)  root.style.setProperty('--bg-light', t.couleur_fond_light);
    if (t.couleur_texte_dark)  root.style.setProperty('--text-dark', t.couleur_texte_dark);
    if (t.couleur_texte_light) root.style.setProperty('--text-light', t.couleur_texte_light);
}

// ============================================
// HERO
// ============================================
async function loadHero() {
    const h = await apiGet('hero');
    if (!h) return;

    // Nom
    const glitch = document.querySelector('.glitch');
    if (glitch && h.nom) { glitch.textContent = h.nom; glitch.setAttribute('data-text', h.nom); }

    // Description
    const desc = document.querySelector('.hero-description');
    if (desc && h.description) desc.textContent = h.description;

    // Titres animés (pour le typed effect)
    if (h.titres_animes && window._typedStrings !== undefined) {
        window._typedStrings = h.titres_animes.split(',').map(s => s.trim());
    }

    // Stats
    const stats = document.querySelectorAll('.stat-item [data-target]');
    if (stats.length >= 3) {
        if (h.stat_projets) stats[0].setAttribute('data-target', h.stat_projets);
        if (h.stat_annees)  stats[1].setAttribute('data-target', h.stat_annees);
        if (h.stat_satisfaction) stats[2].setAttribute('data-target', h.stat_satisfaction);
    }

    // Photo
    const heroImg = document.getElementById('heroImg');
    if (heroImg && h.photo) heroImg.src = h.photo;

    // Réseaux sociaux
    const socials = document.querySelectorAll('.social-icons .social-icon');
    if (socials.length >= 4) {
        if (h.github)   socials[0].href = h.github;
        if (h.linkedin) socials[1].href = h.linkedin;
        if (h.whatsapp) socials[2].href = h.whatsapp.startsWith('http') ? h.whatsapp : 'https://wa.me/' + h.whatsapp;
        if (h.facebook) socials[3].href = h.facebook;
    }
}

// ============================================
// ABOUT
// ============================================
async function loadAbout() {
    const a = await apiGet('about');
    if (!a) return;

    const texts = document.querySelectorAll('.about-text p');
    if (texts[0] && a.texte_principal) texts[0].textContent = a.texte_principal;
    if (texts[1] && a.texte_secondaire) texts[1].textContent = a.texte_secondaire;

    // Détails
    const details = document.querySelectorAll('.detail-item span');
    if (details.length >= 4) {
        if (a.nom)         details[0].textContent = a.nom;
        if (a.localisation) details[1].textContent = a.localisation;
        if (a.disponibilite) details[2].textContent = a.disponibilite;
        if (a.email)       details[3].textContent = a.email;
    }

    // Photo about
    const aboutImg = document.getElementById('aboutImg');
    if (aboutImg && a.photo) aboutImg.src = a.photo;
}

// ============================================
// SKILLS
// ============================================
async function loadSkills() {
    const skills = await apiGet('skills');
    if (!skills || !skills.length) return;

    const container = document.querySelector('.skills-container');
    if (!container) return;
    container.innerHTML = '';

    // Grouper par catégorie
    const cats = {};
    skills.forEach(s => {
        if (!cats[s.categorie]) cats[s.categorie] = [];
        cats[s.categorie].push(s);
    });

    Object.entries(cats).forEach(([cat, catSkills]) => {
        const catDiv = document.createElement('div');
        catDiv.className = 'skills-category';
        catDiv.innerHTML = `<h3 class="category-title">${cat}</h3><div class="skills-grid"></div>`;
        const grid = catDiv.querySelector('.skills-grid');
        catSkills.forEach(s => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            card.setAttribute('data-progress', s.niveau);
            card.innerHTML = `
                <div class="skill-icon"><i class="${s.icone}"></i></div>
                <div class="skill-info">
                    <span class="skill-name">${s.nom}</span>
                    <div class="skill-bar">
                        <div class="skill-progress" data-progress="${s.niveau}"></div>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
        container.appendChild(catDiv);
    });
}

// ============================================
// PROJECTS
// ============================================
async function loadProjects() {
    const projects = await apiGet('projects');
    if (!projects || !projects.length) return;

    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    projects.forEach((p, i) => {
        const num = String(i + 1).padStart(2, '0');
        const techs = (p.technologies || '').split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');
        const features = (p.features || '').split(',').map(f => `
            <div class="feature-item"><i class="fas fa-check"></i><span>${f.trim()}</span></div>`).join('');
        const imgSrc = p.image
            ? (p.image.startsWith('http') ? p.image : p.image)
            : 'dev_fred/asset/placeholder.png';

        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-number">${num}</div>
            <div class="project-image"><img src="${imgSrc}" alt="${p.titre}" class="project-img"></div>
            <div class="project-content">
                <div class="project-tags">${techs}</div>
                <h3>${p.titre}</h3>
                <p>${p.description || ''}</p>
                <div class="project-features">${features}</div>
                <div class="project-links">
                    <a href="${p.lien_demo || '#'}" class="project-link" title="Voir le projet" target="_blank" rel="noopener">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                    <a href="${p.lien_github || '#'}" class="project-link" title="Code source" target="_blank" rel="noopener">
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

// ============================================
// SERVICES
// ============================================
async function loadServices() {
    const services = await apiGet('services');
    if (!services || !services.length) return;

    const grid = document.querySelector('.services-grid');
    if (!grid) return;
    grid.innerHTML = '';

    services.forEach(s => {
        const features = (s.features || '').split(',').map(f => `<li><i class="fas fa-check"></i> ${f.trim()}</li>`).join('');
        const card = document.createElement('div');
        card.className = 'service-card' + (s.featured == 1 ? ' featured' : '');
        card.innerHTML = `
            ${s.featured == 1 ? '<div class="featured-badge">Populaire</div>' : ''}
            <div class="service-icon"><i class="${s.icone}"></i></div>
            <h3>${s.titre}</h3>
            <div class="service-price">${s.prix}</div>
            <ul class="service-features">${features}</ul>
            <div class="service-actions">
                <a href="#contact" class="btn ${s.featured == 1 ? 'btn-primary' : 'btn-outline'}">Commander</a>
                <a href="${s.lien_detail || '#'}" class="btn btn-ghost">En savoir plus</a>
            </div>`;
        grid.appendChild(card);
    });
}

// ============================================
// FAQ
// ============================================
async function loadFaq() {
    const faqItems = await apiGet('faq');
    if (!faqItems || !faqItems.length) return;

    const container = document.querySelector('.faq-container');
    if (!container) return;
    container.innerHTML = '';

    // 2 colonnes
    const col1 = document.createElement('div');
    col1.className = 'faq-column';
    const col2 = document.createElement('div');
    col2.className = 'faq-column';

    faqItems.forEach((f, i) => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.innerHTML = `
            <div class="faq-question">
                <h3><i class="${f.icone}"></i> ${f.question}</h3>
                <i class="fas fa-chevron-down faq-icon"></i>
            </div>
            <div class="faq-answer"><p>${f.reponse}</p></div>`;
        (i % 2 === 0 ? col1 : col2).appendChild(item);
    });

    container.appendChild(col1);
    container.appendChild(col2);

    // Réinitialiser les listeners FAQ accordion
    initFaqAccordion();
}

function initFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.closest('.faq-item');
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isOpen) item.classList.add('active');
        });
    });
}

// ============================================
// CONTACT
// ============================================
async function loadContact() {
    const c = await apiGet('contact');
    if (!c) return;

    // Email
    const emailLink = document.querySelector('.contact-item a[href^="mailto"]');
    if (emailLink && c.email) { emailLink.href = 'mailto:' + c.email; emailLink.textContent = c.email; }

    // WhatsApp
    const waLink = document.querySelector('.contact-item a[href*="wa.me"]');
    if (waLink && c.whatsapp) {
        waLink.href = 'https://wa.me/' + c.whatsapp;
        waLink.textContent = '+' + c.whatsapp;
    }

    // Localisation
    const locEl = document.querySelector('.contact-item p');
    if (locEl && c.localisation) locEl.textContent = c.localisation;

    // Réseaux sociaux footer contact
    const socials = document.querySelectorAll('.social-links-contact .social-link');
    if (socials.length >= 4) {
        if (c.github)   socials[0].href = c.github;
        if (c.linkedin) socials[1].href = c.linkedin;
        if (c.whatsapp) socials[2].href = 'https://wa.me/' + c.whatsapp;
        if (c.facebook) socials[3].href = c.facebook;
    }
}

// ============================================
// FORMULAIRE DE CONTACT — Envoi via API
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        btn.disabled = true;
        try {
            const body = {
                nom:     form.querySelector('#name')?.value || '',
                email:   form.querySelector('#email')?.value || '',
                sujet:   form.querySelector('#subject')?.value || '',
                message: form.querySelector('#message')?.value || ''
            };
            const res = await fetch(API_BASE + '?section=messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                btn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
                btn.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';
                form.reset();
                setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; btn.style.background = ''; }, 3000);
            } else throw new Error(data.message);
        } catch (err) {
            btn.innerHTML = '<i class="fas fa-times"></i> Erreur, réessayez';
            btn.style.background = 'linear-gradient(135deg, #ff6584, #ff4d6d)';
            setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; btn.style.background = ''; }, 3000);
        }
    });
}

// ============================================
// INITIALISATION PRINCIPALE
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Charger le thème en premier (pour éviter le flash)
    await loadTheme();

    // Charger toutes les sections en parallèle
    await Promise.all([
        loadHero(),
        loadAbout(),
        loadSkills(),
        loadProjects(),
        loadServices(),
        loadFaq(),
        loadContact()
    ]);

    // Initialiser le formulaire de contact
    initContactForm();

    // Déclencher un event pour que script.js re-initialise les animations
    document.dispatchEvent(new Event('api-loaded'));
});
