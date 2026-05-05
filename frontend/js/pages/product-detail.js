window.addEventListener('DOMContentLoaded', async () => {
    createNav('');
    const id = getQueryParam('id');
    const content = document.getElementById('product-content');
    const message = document.getElementById('product-message');

    if (!id || !content) {
        if (message) message.textContent = 'Aucun identifiant de jeu trouvé dans l’URL.';
        return;
    }

    try {
        const game = await fetchGameById(id);
        renderProduct(game);
        if (message) message.textContent = 'Détails du produit';
    } catch (error) {
        if (message) message.textContent = error.message;
    }
});

function renderProduct(game) {
    const content = document.getElementById('product-content');
    if (!content) return;

    // Images de promo (toujours les mêmes) - si le jeu a au moins 3 images, les 2 premières sont promo
    const hasPromoImages = (game.images?.length || 0) >= 3;
    const promoImages = hasPromoImages ? game.images?.slice(0, 2) || [] : [];
    // Images spécifiques par plateforme
    const platformImages = hasPromoImages ? game.images?.slice(2) || [] : game.images || [];
    const platforms = game.caracteristiques?.plateformes || [];

    // Image principale par défaut (première image de plateforme ou promo)
    const defaultImage = platformImages[0] || promoImages[0] || 'https://via.placeholder.com/520x320?text=Image+manquante';

    content.innerHTML = `
        <div class="product-hero">
            <div class="product-image">
                <img id="main-product-image" src="${defaultImage}" alt="${game.nom}" onerror="this.src='https://via.placeholder.com/520x320?text=Image+manquante'">
                ${platforms.length > 0 ? `
                <div class="platform-selector">
                    <label for="platform-select">Version :</label>
                    <select id="platform-select" class="platform-select">
                        ${platforms.map((platform, index) => `<option value="${index}">${platform}</option>`).join('')}
                    </select>
                </div>
                ` : ''}
            </div>
            <div class="product-summary">
                <h2>${game.nom}</h2>
                <p class="product-price">${game.prix.toFixed(2)} ${game.devise}</p>
                <p class="product-description">${game.description}</p>
                <ul class="product-meta">
                    <li><strong>Genre :</strong> ${game.caracteristiques?.genre || 'Indéterminé'}</li>
                    <li><strong>Plateformes :</strong> ${platforms.join(', ') || 'N/A'}</li>
                    <li><strong>Variantes :</strong> ${game.caracteristiques?.variantes?.join(', ') || 'N/A'}</li>
                    <li><strong>Stock :</strong> ${game.quantite}</li>
                </ul>
                <div class="product-actions">
                    <button type="button" class="button button-primary" id="add-cart-btn">Ajouter au panier</button>
                    <button type="button" class="button button-secondary" id="favorite-btn">Ajouter aux favoris</button>
                </div>
            </div>
        </div>
        ${hasPromoImages && promoImages.length > 0 ? `
        <div class="product-gallery">
            <h3>Images promotionnelles</h3>
            <div class="promo-images">
                ${promoImages.map(img => `
                    <div class="promo-image">
                        <img src="${img}" alt="${game.nom} - Promo" onerror="this.src='https://via.placeholder.com/300x200?text=Image+introuvable'">
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;

    // Gestionnaire pour le changement de plateforme
    const platformSelect = document.getElementById('platform-select');
    const mainImage = document.getElementById('main-product-image');

    if (platformSelect && mainImage) {
        platformSelect.addEventListener('change', (e) => {
            const selectedIndex = parseInt(e.target.value);
            const selectedImage = platformImages[selectedIndex] || defaultImage;
            mainImage.src = selectedImage;
        });
    }

    document.getElementById('add-cart-btn')?.addEventListener('click', () => {
        const selectedIndex = parseInt(platformSelect?.value || '0', 10);
        const selectedVersion = platforms[selectedIndex] || 'Standard';
        const selectedImage = platformImages[selectedIndex] || defaultImage;
        addToCart({ ...game, selectedVersion, selectedImage });
    });
    document.getElementById('favorite-btn')?.addEventListener('click', () => {
        toggleFavorite(game);
    });
}
