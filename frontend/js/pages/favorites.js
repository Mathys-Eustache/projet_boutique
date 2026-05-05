window.addEventListener('DOMContentLoaded', () => {
    createNav('favorites');
    renderFavorites();
});

function renderFavorites() {
    const favorites = getFavorites();
    const container = document.getElementById('favorites-list');
    const emptyMessage = document.getElementById('favorites-empty');

    if (!container || !emptyMessage) return;
    container.innerHTML = '';

    if (favorites.length === 0) {
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';

    favorites.forEach(item => {
        const card = document.createElement('article');
        const image = item.image || 'https://via.placeholder.com/360x220?text=Favori';
        card.className = 'catalog-card';
        card.innerHTML = `
            <a class="card-link" href="product.html?id=${encodeURIComponent(item.id)}">
                <div class="card-image">
                    <img src="${image}" alt="${item.nom}" onerror="this.src='https://via.placeholder.com/360x220?text=Image+manquante'">
                </div>
                <div class="card-content">
                    <h2>${item.nom}</h2>
                    <p class="card-price">${item.prix.toFixed(2)} ${item.devise}</p>
                </div>
            </a>
            <div class="card-actions">
                <button type="button" class="button button-primary button-small" data-add-cart="${item.id}">Ajouter au panier</button>
                <button type="button" class="button button-secondary button-small" data-remove="${item.id}">Retirer</button>
            </div>
        `;
        container.appendChild(card);
        card.querySelector('[data-add-cart]')?.addEventListener('click', () => {
            addToCart(item);
        });
        card.querySelector('[data-remove]')?.addEventListener('click', () => {
            const remaining = getFavorites().filter(f => f.id !== item.id);
            saveFavorites(remaining);
            updateHeaderCounts();
            renderFavorites();
        });
    });
}