const API_BASE = 'http://localhost:3000/api/games';

async function fetchGames(filters = {}) {
    const url = new URL(API_BASE);
    if (filters.platform) {
        url.searchParams.set('plateforme', filters.platform);
    } else if (filters.genre) {
        url.searchParams.set('genre', filters.genre);
    } else {
        url.searchParams.set('prixMax', filters.prixMax || '9999');
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Impossible de récupérer les jeux.');
    }
    const data = await response.json();
    return data.gameData || [];
}

async function fetchGameById(id) {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(id)}`);
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Jeu introuvable');
    }
    const data = await response.json();
    return data.gameData;
}

// Exposer les fonctions globalement
window.fetchGames = fetchGames;
window.fetchGameById = fetchGameById;
