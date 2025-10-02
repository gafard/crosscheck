/**
 * Script pour intégrer facilement des vidéos TikTok dans la page videos.html
 * Usage: Modifiez le tableau 'videos' ci-dessous avec vos vraies vidéos TikTok
 */

// Configuration des vidéos TikTok
const videos = [
    {
        id: 1,
        title: "Preuves de l'existence de Dieu",
        description: "Une approche moderne de l'apologétique chrétienne à travers des arguments scientifiques et philosophiques.",
        category: "Apologétique",
        duration: "2 min",
        tiktokUrl: "https://www.tiktok.com/@thegodproof/video/123456789", // Remplacez par l'URL réelle
        embedCode: `
            <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@thegodproof/video/123456789" data-video-id="123456789">
                <section>
                    <a target="_blank" title="@thegodproof" href="https://www.tiktok.com/@thegodproof">@thegodproof</a>
                    <p>Preuves de l'existence de Dieu</p>
                    <a target="_blank" title="♬ son original" href="https://www.tiktok.com/music/son-original-123456789">♬ son original</a>
                </section>
            </blockquote>
            <script async src="https://www.tiktok.com/embed.js"></script>
        `,
        icon: "📱"
    },
    {
        id: 2,
        title: "Le Big Bang et la Création",
        description: "Comment la cosmologie moderne confirme l'existence d'un Créateur intelligent.",
        category: "Science",
        duration: "1.5 min",
        tiktokUrl: "https://www.tiktok.com/@thegodproof/video/987654321", // Remplacez par l'URL réelle
        embedCode: `
            <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@thegodproof/video/987654321" data-video-id="987654321">
                <section>
                    <a target="_blank" title="@thegodproof" href="https://www.tiktok.com/@thegodproof">@thegodproof</a>
                    <p>Le Big Bang et la Création</p>
                    <a target="_blank" title="♬ son original" href="https://www.tiktok.com/music/son-original-987654321">♬ son original</a>
                </section>
            </blockquote>
            <script async src="https://www.tiktok.com/embed.js"></script>
        `,
        icon: "🔬"
    },
    {
        id: 3,
        title: "Découvertes Archéologiques",
        description: "Les preuves archéologiques qui confirment l'historicité des récits bibliques.",
        category: "Archéologie",
        duration: "2.5 min",
        tiktokUrl: "https://www.tiktok.com/@thegodproof/video/456789123", // Remplacez par l'URL réelle
        embedCode: `
            <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@thegodproof/video/456789123" data-video-id="456789123">
                <section>
                    <a target="_blank" title="@thegodproof" href="https://www.tiktok.com/@thegodproof">@thegodproof</a>
                    <p>Découvertes Archéologiques</p>
                    <a target="_blank" title="♬ son original" href="https://www.tiktok.com/music/son-original-456789123">♬ son original</a>
                </section>
            </blockquote>
            <script async src="https://www.tiktok.com/embed.js"></script>
        `,
        icon: "🏛️"
    }
];

/**
 * Fonction pour générer le HTML d'une vidéo TikTok
 */
function generateVideoHTML(video) {
    return `
        <div class="video-card fade-in-up">
            <div class="video-embed">
                ${video.embedCode || `
                    <div class="tiktok-placeholder">
                        <div class="tiktok-icon">${video.icon}</div>
                        <h3>${video.title}</h3>
                        <p>Intégrez ici votre vidéo TikTok</p>
                        <a href="${video.tiktokUrl}" class="tiktok-link" target="_blank">
                            Voir sur TikTok
                        </a>
                    </div>
                `}
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
                <div class="video-meta">
                    <span class="video-category">${video.category}</span>
                    <span>${video.duration}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Fonction pour générer tout le HTML de la grille de vidéos
 */
function generateVideosGrid() {
    return videos.map(video => generateVideoHTML(video)).join('\n');
}

/**
 * Instructions pour utiliser ce script
 */
console.log(`
🎥 GUIDE D'INTÉGRATION TIKTOK
=============================

1. OBTENIR LE CODE D'INTÉGRATION :
   - Allez sur votre vidéo TikTok
   - Cliquez sur "Partager" → "Intégrer"
   - Copiez le code fourni

2. MODIFIER CE SCRIPT :
   - Remplacez les URLs dans le tableau 'videos'
   - Remplacez les 'embedCode' par vos vrais codes TikTok
   - Ajustez les titres et descriptions

3. GÉNÉRER LE HTML :
   - Exécutez : generateVideosGrid()
   - Copiez le résultat dans videos.html

4. EXEMPLE DE CODE D'INTÉGRATION TIKTOK :
   <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@username/video/ID" data-video-id="ID">
     <section>
       <a target="_blank" title="@username" href="https://www.tiktok.com/@username">@username</a>
       <p>Description de la vidéo</p>
     </section>
   </blockquote>
   <script async src="https://www.tiktok.com/embed.js"></script>

5. WIDGET DE FLUX AUTOMATIQUE :
   Pour afficher automatiquement toutes les vidéos de @thegodproof :
   - Utilisez EmbedSocial : https://embedsocial.com/tiktok-widget/
   - Ou Flockler : https://flockler.com/
`);

// Export pour utilisation dans le navigateur
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { videos, generateVideoHTML, generateVideosGrid };
}
