const CART_KEY = 'yshop-cart';
const FAVORITES_KEY = 'yshop-favorites';

const apiBaseUrl = 'http://localhost:3000/api/games';
let currentCatalogGames = [];

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function isFavorite(gameId) {
    return getFavorites().some(item => item.id === gameId);
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function addToCart(game) {
    const cart = getCart();
    const existing = cart.find(item => item.id === game.id);
    if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, 99);
    } else {
        cart.push({ ...game, quantity: 1 });
    }
    saveCart(cart);
    updateHeaderCounts();
}

function removeFromCart(gameId) {
    const cart = getCart().filter(item => item.id !== gameId);
    saveCart(cart);
    updateHeaderCounts();
}

function updateCartQuantity(gameId, quantity) {
    const cart = getCart();
    const item = cart.find(entry => entry.id === gameId);
    if (item) {
        item.quantity = Math.max(1, Math.min(quantity, 99));
        saveCart(cart);
    }
}

function toggleFavorite(game) {
    const favorites = getFavorites();
    const existing = favorites.find(item => item.id === game.id);
    if (existing) {
        const next = favorites.filter(item => item.id !== game.id);
        saveFavorites(next);
        updateHeaderCounts();
        return false;
    }
    favorites.push({ id: game.id, nom: game.nom, prix: game.prix, devise: game.devise, image: game.images?.[0] || '' });
    saveFavorites(favorites);
    updateHeaderCounts();
    return true;
}

function createNav(active) {
    const nav = document.getElementById('nav');
    if (!nav) return;
    nav.innerHTML = `
        <header class="site-header">
            <div class="brand">
                <a href="index.html">Y-Shop</a>
            </div>
            <nav class="site-menu">
                <a href="catalog.html" class="${active === 'catalog' ? 'active' : ''}">Catalogue</a>
                <a href="cart.html" class="${active === 'cart' ? 'active' : ''}">Panier (<span id="cart-count">0</span>)</a>
                <a href="favorites.html" class="${active === 'favorites' ? 'active' : ''}">Favoris (<span id="favorites-count">0</span>)</a>
            </nav>
        </header>
    `;
    updateHeaderCounts();
}

function updateHeaderCounts() {
    const cartCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
    const favoritesCount = getFavorites().length;
    const cartCountNode = document.getElementById('cart-count');
    const favCountNode = document.getElementById('favorites-count');
    if (cartCountNode) cartCountNode.textContent = cartCount;
    if (favCountNode) favCountNode.textContent = favoritesCount;
}

function createCard(game, options = {}) {
    const card = document.createElement('article');
    card.className = 'catalog-card';
    const imagePath = game.images?.[0] || 'https://via.placeholder.com/360x220?text=Pas+d\'image';
    const favoriteActive = isFavorite(game.id);
    card.innerHTML = `
        <a class="card-link" href="product.html?id=${encodeURIComponent(game.id)}">
            <div class="card-image">
                <img src="${imagePath}" alt="${game.nom}" onerror="this.src='https://via.placeholder.com/360x220?text=Image+introuvable'">
            </div>
            <div class="card-content">
                <h2>${game.nom}</h2>
                <p class="card-price">${game.prix.toFixed(2)} ${game.devise}</p>
                <p class="card-genre">${game.caracteristiques?.genre || 'Genre inconnu'}</p>
            </div>
        </a>
        <div class="card-actions">
            <button type="button" class="button button-small" data-add-cart="${game.id}">Ajouter au panier</button>
            <button type="button" class="favorite-button" data-favorite="${game.id}" aria-label="${favoriteActive ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                <span class="favorite-star ${favoriteActive ? 'filled' : ''}">${favoriteActive ? '★' : '☆'}</span>
            </button>
        </div>
    `;
    if (options.onCartClick) {
        card.querySelector('[data-add-cart]')?.addEventListener('click', event => {
            event.preventDefault();
            options.onCartClick(game);
        });
    }
    if (options.onFavoriteClick) {
        card.querySelector('[data-favorite]')?.addEventListener('click', event => {
            event.preventDefault();
            options.onFavoriteClick(game);
        });
    }
    return card;
}

function buildFilterForm(container, onSubmit) {
    if (!container) return;
    container.innerHTML = `
        <form id="filter-form" class="filter-form">
            <div class="filter-control">
                <label for="platform">Plateforme</label>
                <select id="platform" name="platform">
                    <option value="">Toutes</option>
                    <option>PS4</option>
                    <option>PS5</option>
                    <option>Xbox Series X</option>
                    <option>Nintendo Switch</option>
                </select>
            </div>
            <div class="filter-control">
                <label for="genre">Genre</label>
                <select id="genre" name="genre">
                    <option value="">Tous</option>
                    <option>Action-RPG</option>
                    <option>Metroidvania</option>
                    <option>Rogue-like</option>
                </select>
            </div>
            <div class="filter-control">
                <label for="prixMax">Prix max (€)</label>
                <input id="prixMax" name="prixMax" type="number" step="0.01" min="0" placeholder="9999">
            </div>
            <div class="filter-actions">
                <button type="submit" class="button button-primary">Appliquer</button>
                <button type="button" class="button button-secondary" id="clear-filter">Réinitialiser</button>
            </div>
        </form>
    `;
    const form = container.querySelector('#filter-form');
    form?.addEventListener('submit', event => {
        event.preventDefault();
        const platform = form.platform.value.trim();
        const genre = form.genre.value.trim();
        const prixMax = form.prixMax.value.trim();
        onSubmit({ platform, genre, prixMax });
    });
    container.querySelector('#clear-filter')?.addEventListener('click', () => {
        form.platform.value = '';
        form.genre.value = '';
        form.prixMax.value = '';
        onSubmit({ platform: '', genre: '', prixMax: '' });
    });
}

function getQueryParam(name) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
}

function showMessage(container, message) {
    if (!container) return;
    container.innerHTML = `<div class="empty-state">${message}</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    if (body.classList.contains('page-home')) {
        createNav('home');
        initHomeCarousel();
        return;
    }
    if (body.classList.contains('page-catalog')) {
        createNav('catalog');
        return;
    }
    if (body.classList.contains('page-cart')) {
        createNav('cart');
        return;
    }
    if (body.classList.contains('page-favorites')) {
        createNav('favorites');
        return;
    }
    createNav('');
});

function initHomeCarousel() {
    const carousel = document.querySelector('.home-carousel');
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const buttons = Array.from(carousel.querySelectorAll('.carousel-dot'));
    let activeIndex = 0;
    let timer = null;

    function setActive(index) {
        activeIndex = index;
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === index);
        });
        buttons.forEach((button, idx) => {
            button.classList.toggle('active', idx === index);
        });
    }

    function nextSlide() {
        setActive((activeIndex + 1) % slides.length);
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.slide);
            setActive(index);
            clearInterval(timer);
            timer = setInterval(nextSlide, 6000);
        });
    });

    setActive(0);
    timer = setInterval(nextSlide, 6000);
}
