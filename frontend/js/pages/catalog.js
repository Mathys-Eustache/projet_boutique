window.currentCatalogGames = [];

async function initializeCatalogPage() {
    createNav('catalog');
    const contentPanel = document.querySelector('.content-panel');
    if (!contentPanel) return;

    const filterPanel = document.createElement('div');
    filterPanel.className = 'catalog-panel';
    contentPanel.appendChild(filterPanel);

    buildFilterForm(filterPanel, async filters => {
        try {
            const games = await fetchGames(filters);
            window.currentCatalogGames = games;
            renderCatalog(games);
        } catch (error) {
            renderCatalog([], error.message);
        }
    });

    try {
        const games = await fetchGames({ prixMax: '9999' });
        window.currentCatalogGames = games;
        renderCatalog(games);
    } catch (error) {
        renderCatalog([], error.message);
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initializeCatalogPage);
} else {
    initializeCatalogPage();
}

function renderCatalog(games, errorMessage) {
    const contentPanel = document.querySelector('.content-panel');
    if (!contentPanel) return;
    const existing = document.getElementById('catalog-grid');
    existing?.remove();

    const grid = document.createElement('section');
    grid.id = 'catalog-grid';
    grid.className = 'catalog-grid';

    if (errorMessage) {
        showMessage(grid, errorMessage);
        contentPanel.appendChild(grid);
        return;
    }

    if (games.length === 0) {
        showMessage(grid, 'Aucun jeu trouvé. Essayez de modifier le filtre.');
        contentPanel.appendChild(grid);
        return;
    }

    games.forEach(game => {
        const card = createCard(game, {
            onCartClick: addToCart,
            onFavoriteClick: gameData => {
                const favoriteAdded = toggleFavorite(gameData);
                renderCatalog(window.currentCatalogGames);
            }
        });
        grid.appendChild(card);
    });

    contentPanel.appendChild(grid);
}

window.renderCatalog = renderCatalog;
