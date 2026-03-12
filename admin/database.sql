-- ============================================
-- PORTFOLIO DEVJ - Base de données
-- Importer dans phpMyAdmin ou MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS portfolio_devj CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_devj;

-- Table Admin (connexion)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer admin par défaut (mot de passe: admin123 — à changer !)
INSERT INTO admin_users (email, password) VALUES
('frejus@devj.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Table Hero
CREATE TABLE IF NOT EXISTS hero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) DEFAULT 'Frejus Kouadio',
    titre_principal VARCHAR(255) DEFAULT 'Développeur Frontend & IA',
    titres_animes TEXT DEFAULT 'Développeur Frontend,Intégrateur Web,Passionné d\'IA,Creative Coder',
    description TEXT DEFAULT 'Passionné par la création d\'expériences web exceptionnelles et l\'intelligence artificielle.',
    stat_projets INT DEFAULT 5,
    stat_annees INT DEFAULT 2,
    stat_satisfaction INT DEFAULT 100,
    photo VARCHAR(500) DEFAULT 'dev_fred/asset/2026010323251463.png',
    github VARCHAR(500) DEFAULT 'https://github.com/devj-58',
    linkedin VARCHAR(500) DEFAULT 'https://www.linkedin.com/in/frejus-kouadio-316238329',
    whatsapp VARCHAR(500) DEFAULT 'https://wa.me/2250767998373',
    facebook VARCHAR(500) DEFAULT 'https://www.facebook.com/profile.php?id=61572566502278',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO hero (id) VALUES (1) ON DUPLICATE KEY UPDATE id=1;

-- Table About
CREATE TABLE IF NOT EXISTS about (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texte_principal TEXT DEFAULT 'Passionné par le développement frontend et basé à Yamoussoukro, Côte d\'Ivoire, je suis DevJ.',
    texte_secondaire TEXT DEFAULT 'Avec une expertise en HTML/CSS, JavaScript et React, je crée des interfaces modernes et performantes.',
    nom VARCHAR(255) DEFAULT 'Frejus Kouadio',
    localisation VARCHAR(255) DEFAULT 'Yamoussoukro, Côte d\'Ivoire',
    disponibilite VARCHAR(255) DEFAULT 'Disponible',
    email VARCHAR(255) DEFAULT 'frejuskouadio@gmail.com',
    photo VARCHAR(500) DEFAULT 'dev_fred/asset/2026010323253284.png',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO about (id) VALUES (1) ON DUPLICATE KEY UPDATE id=1;

-- Table Compétences
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    icone VARCHAR(100) DEFAULT 'fas fa-code',
    niveau INT DEFAULT 80,
    categorie VARCHAR(100) DEFAULT 'Frontend',
    ordre INT DEFAULT 0
);

INSERT INTO skills (nom, icone, niveau, categorie, ordre) VALUES
('HTML5', 'fab fa-html5', 95, 'Frontend', 1),
('CSS3 / SASS', 'fab fa-css3-alt', 90, 'Frontend', 2),
('JavaScript', 'fab fa-js', 85, 'Frontend', 3),
('React.js', 'fab fa-react', 80, 'Frontend', 4),
('GSAP / Animations', 'fas fa-magic', 90, 'Frontend', 5),
('Responsive Design', 'fas fa-mobile-alt', 75, 'Frontend', 6),
('PHP', 'fab fa-php', 85, 'Backend', 7),
('MySQL', 'fas fa-database', 80, 'Backend', 8),
('Git / GitHub', 'fab fa-git-alt', 90, 'Outils', 9),
('Figma', 'fab fa-figma', 85, 'Outils', 10),
('VS Code', 'fas fa-code', 88, 'Outils', 11),
('Google AI', 'fas fa-robot', 75, 'IA', 12);

-- Table Projets
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    lien_demo VARCHAR(500) DEFAULT '#',
    lien_github VARCHAR(500) DEFAULT 'https://github.com/devj-58',
    technologies TEXT,
    features TEXT,
    categorie VARCHAR(100) DEFAULT 'Web',
    featured TINYINT(1) DEFAULT 0,
    ordre INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects (titre, description, image, lien_demo, lien_github, technologies, features, categorie, ordre) VALUES
('Eliko Voyage', 'Interface moderne pour agence de voyage permettant la réservation en ligne, la découverte de destinations et la gestion de séjours personnalisés.', 'dev_fred/asset/eliko.PNG', 'https://devj-58.github.io/eliko_voyage/', 'https://github.com/devj-58', 'HTML/CSS,JavaScript', 'Réservation en ligne,Interface responsive,Dashboard admin', 'Web', 1),
('SanteAI', 'Plateforme innovante de télémédecine connectant patients et professionnels de santé avec consultations vidéo.', 'dev_fred/asset/santeAI.jpg', 'https://devpost.com/software/santeai', 'https://github.com/devj-58', 'React,Google AI,WebRTC', 'Consultations vidéo,Dossiers médicaux,IA intégrée', 'IA', 2),
('Système de Gestion de Bibliothèque - UIYA', 'Projet réalisé pour l\'Université Internationale de Yamoussoukro. Système complet avec espace bibliothécaire et lecteur.', 'dev_fred/asset/uiya.PNG', 'https://bibliotheque.igl-uiya.com/', 'https://github.com/devj-58', 'HTML,CSS,JavaScript', 'Gestion temps réel,Suivi des lecteurs,Système de scan', 'Web', 3),
('GSB - Gestion de Stock', 'Système complet de gestion de stock incluant inventaire en temps réel, suivi des ventes et analyses statistiques.', 'dev_fred/asset/GSB.jpg', '#', 'https://github.com/devj-58', 'PHP,Bootstrap,MySQL', 'Inventaire temps réel,Alertes automatiques,Rapports détaillés', 'Web', 4),
('ZikmuCI', 'Plateforme musicale ivoirienne minimaliste célébrant la richesse de la musique populaire.', 'dev_fred/asset/zikmu.jpg', 'https://devj-58.github.io/ZikmuCi/index.html', 'https://github.com/devj-58', 'HTML5,CSS3,JavaScript', 'Design responsive mobile-first,Animations fluides CSS3,Navigation intuitive', 'Web', 5),
('Terasse', 'Petit site vitrine proposant articles éducatifs et ressources sur le changement climatique en Côte d\'Ivoire.', 'dev_fred/asset/terasse.jpg', 'https://terasse-ivoire.vercel.app', 'https://github.com/devj-58', 'HTML,CSS,JavaScript', 'Navigation fixe et accessible,Images optimisées,Layout deux-colonnes réactif', 'Web', 6);

-- Table Services
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    icone VARCHAR(100) DEFAULT 'fas fa-code',
    prix VARCHAR(100) DEFAULT 'Sur Devis',
    features TEXT,
    featured TINYINT(1) DEFAULT 0,
    lien_detail VARCHAR(500) DEFAULT '#',
    ordre INT DEFAULT 0
);

INSERT INTO services (titre, icone, prix, features, featured, lien_detail, ordre) VALUES
('Site Vitrine', 'fas fa-palette', '300 000 FCFA', 'Design moderne et responsive,Jusqu\'à 5 pages,Formulaire de contact,Optimisation SEO de base,Hébergement inclus 1 an,Support 24/7', 0, 'site-vitrine.html', 1),
('Site E-commerce', 'fas fa-shopping-cart', '500 000 FCFA', 'Boutique en ligne complète,Gestion produits illimitée,Paiement sécurisé,Tableau de bord admin,Formation incluse,Support prioritaire', 1, 'ecommerce.html', 2),
('Solution Sur Mesure', 'fas fa-code', 'Sur Devis', 'Solution 100% personnalisée,Fonctionnalités avancées,Intégrations sur mesure,Support prioritaire,Évolutivité garantie,Maintenance incluse', 0, 'sur-mesure.html', 3);

-- Table FAQ
CREATE TABLE IF NOT EXISTS faq (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    reponse TEXT NOT NULL,
    icone VARCHAR(100) DEFAULT 'fas fa-question-circle',
    ordre INT DEFAULT 0
);

INSERT INTO faq (question, reponse, icone, ordre) VALUES
('Quels sont vos délais de livraison ?', 'Les délais varient selon le projet : 1-2 semaines pour un site vitrine, 3-4 semaines pour un e-commerce, et sur devis pour les solutions sur mesure. Je m\'engage à respecter les échéances convenues.', 'fas fa-clock', 1),
('Proposez-vous des services de design ?', 'Oui, je prends en charge l\'intégralité du processus : maquettes sur Figma, développement frontend, animations GSAP, et optimisation responsive. Un design moderne et professionnel est garanti.', 'fas fa-paint-brush', 2),
('Vos sites sont-ils responsive ?', 'Absolument ! Tous mes projets sont entièrement responsive et optimisés pour mobile, tablette et desktop. Je teste sur de multiples appareils pour garantir une expérience parfaite.', 'fas fa-mobile-alt', 3),
('Assurez-vous la maintenance ?', 'Oui, je propose des contrats de maintenance mensuels incluant mises à jour, corrections de bugs, ajout de contenu et support technique. La tranquillité d\'esprit est garantie.', 'fas fa-tools', 4),
('Comment se déroule un projet ?', '1) Rendez-vous découverte et cahier des charges, 2) Maquettes et validation, 3) Développement avec points réguliers, 4) Tests et ajustements, 5) Livraison et formation, 6) Suivi post-lancement.', 'fas fa-rocket', 5),
('Quels modes de paiement acceptez-vous ?', 'J\'accepte les virements bancaires, Mobile Money (Orange, MTN, Moov) et Wave. Paiement en 2 fois : 50% au lancement, 50% à la livraison. Devis gratuit sur demande.', 'fas fa-credit-card', 6),
('Proposez-vous des formations ?', 'Oui ! Je forme à l\'utilisation de votre site. Je propose également du mentorat en développement web (HTML/CSS/JavaScript/React) pour débutants et intermédiaires.', 'fas fa-graduation-cap', 7),
('Travaillez-vous à l\'international ?', 'Oui, je travaille avec des clients partout dans le monde via visioconférence. Collaboration fluide en français et anglais, avec des outils professionnels (Slack, Trello, GitHub).', 'fas fa-globe', 8);

-- Table Contact
CREATE TABLE IF NOT EXISTS contact_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) DEFAULT 'frejuskouadio@gmail.com',
    telephone VARCHAR(50) DEFAULT '+225 07 67 99 83 73',
    whatsapp VARCHAR(50) DEFAULT '2250767998373',
    localisation VARCHAR(255) DEFAULT 'Yamoussoukro, Côte d\'Ivoire',
    github VARCHAR(500) DEFAULT 'https://github.com/devj-58',
    linkedin VARCHAR(500) DEFAULT 'https://www.linkedin.com/in/frejus-kouadio-316238329',
    facebook VARCHAR(500) DEFAULT 'https://www.facebook.com/profile.php?id=61572566502278',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO contact_info (id) VALUES (1) ON DUPLICATE KEY UPDATE id=1;

-- Table Style / Thème
CREATE TABLE IF NOT EXISTS theme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couleur_primaire VARCHAR(20) DEFAULT '#6c63ff',
    couleur_secondaire VARCHAR(20) DEFAULT '#ff6584',
    couleur_accent VARCHAR(20) DEFAULT '#43e97b',
    couleur_fond_dark VARCHAR(20) DEFAULT '#0a0a0f',
    couleur_fond_light VARCHAR(20) DEFAULT '#f8f9ff',
    couleur_texte_dark VARCHAR(20) DEFAULT '#e0e0e0',
    couleur_texte_light VARCHAR(20) DEFAULT '#1a1a2e',
    police_principale VARCHAR(100) DEFAULT 'Syne',
    police_code VARCHAR(100) DEFAULT 'Space Mono',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO theme (id) VALUES (1) ON DUPLICATE KEY UPDATE id=1;

-- Table Messages reçus (formulaire de contact)
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    email VARCHAR(255),
    sujet VARCHAR(255),
    message TEXT,
    lu TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
