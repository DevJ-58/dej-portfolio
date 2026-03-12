// ==========================================
// GÉNÉRATEUR DE CV EN PDF - VERSION SIMPLE
// ==========================================

function generateCVPDF() {
    const { jsPDF } = window.jspdf || window.jspdf || {};
    if (!window.jspdf) {
        console.error('jsPDF non chargé. Vérifiez la balise <script> pour jspdf.');
        return;
    }
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 20;

    function addSection(title) {
        y += 8;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        // Title in dark color; use a soft green only for the rule below
        doc.setTextColor(30, 30, 30);
        doc.text(title, margin, y);
        y += 6;
        // subtle green rule
        doc.setDrawColor(200, 230, 215);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
    }

    // En-tête
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('FREJUS KOUADIO', margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    // Subtitle in muted dark gray (avoid strong green)
    doc.setTextColor(90, 90, 90);
    doc.text('Développeur Frontend & Spécialiste IA', margin, y);
    y += 8;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text('devfred58@gmail.com | +225 0767998373 | Yamoussoukro, Côte d\'Ivoire', margin, y);
    y += 10;

    // Profil
    addSection('PROFIL PROFESSIONNEL');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const profil = "Développeur Frontend passionné, spécialisé en React et intelligence artificielle. Conception d'interfaces performantes, accessibles et esthétiques, avec un souci du détail et de la performance.";
    const profilLines = doc.splitTextToSize(profil, pageWidth - margin * 2);
    doc.text(profilLines, margin, y);
    y += profilLines.length * 5;

    // Compétences
    addSection('COMPÉTENCES TECHNIQUES');
    const comps = [
        'Frontend: HTML5, CSS3, JavaScript, React, TypeScript',
        'IA & ML: Python, TensorFlow, NLP',
        'Outils: Git, Docker, Figma, Webpack, NPM',
        'Méthodes: Agile, Mobile-First, UX/UI'
    ];
    doc.setFontSize(10);
    comps.forEach(c => {
        const lines = doc.splitTextToSize(c, pageWidth - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 5;
    });

    // Projets
    addSection('PROJETS RÉALISÉS');
    const projects = [
        { name: 'ELIKO', desc: 'Plateforme ecommerce complète (React, paiement, gestion utilisateurs)' },
        { name: 'SanteAI', desc: 'Diagnostic médical IA (Python, TensorFlow)' },
        { name: 'DYCHAT', desc: 'Application de messagerie temps réel (Socket.io)'}
    ];
    projects.forEach(p => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30,30,30);
        doc.text(p.name, margin, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const pl = doc.splitTextToSize(p.desc, pageWidth - margin * 2);
        doc.text(pl, margin + 4, y);
        y += pl.length * 5;
    });

    // Services
    addSection('SERVICES');
    const services = [
        'Développement Frontend (React/TS)',
        'Intégration IA & ML',
        'Optimisation des performances web',
        'Design responsive & UX'
    ];
    services.forEach(s => {
        const lines = doc.splitTextToSize('• ' + s, pageWidth - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 5;
    });

    // Expérience
    addSection('EXPÉRIENCE');
    const exp = '2+ ans en développement frontend et intégration d\'IA, livraison de projets clients avec emphase sur la qualité et la performance.';
    const expLines = doc.splitTextToSize(exp, pageWidth - margin * 2);
    doc.text(expLines, margin, y);
    y += expLines.length * 5;

    // À propos
    addSection('À PROPOS');
    const about = 'Passionné par l\'innovation et l\'excellence du code. Approche centrée utilisateur et amélioration continue.';
    const aboutLines = doc.splitTextToSize(about, pageWidth - margin * 2);
    doc.text(aboutLines, margin, y);
    y += aboutLines.length * 5;

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150,150,150);
    doc.text('Portfolio: mon-portfolio.com | GitHub: github.com/devj-58', margin, doc.internal.pageSize.getHeight() - 10);
    doc.text('Généré: ' + new Date().toLocaleDateString('fr-FR'), margin, doc.internal.pageSize.getHeight() - 5);

    doc.save('CV_Frejus_Kouadio.pdf');
}

// Initialise le bouton CV une seule fois et évite le double-attachment
function initCVButton() {
    if (initCVButton._attached) return;
    initCVButton._attached = true;
    const downloadBtn = document.getElementById('downloadCVBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                generateCVPDF();
            } catch (err) {
                console.error('Erreur lors de la génération du PDF:', err);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initCVButton);
