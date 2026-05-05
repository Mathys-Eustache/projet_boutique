const games = require("../data/games.json");
const fs = require('fs');
const path = require('path');

const getAllGames = (req, res) => {
    const plateformeDemande = req.query.plateforme;
    const genreDemande = req.query.genre;
    const prixMax = req.query.prixMax; 

    if (plateformeDemande) {
        const gameFilters = games.filter(jeu => {
            return jeu.caracteristiques.plateformes.includes(plateformeDemande);
        });

        if (gameFilters.length === 0) {
            return res.status(404).json({
                message: 'Aucun jeu introuvable pour cette plateforme'
            });
        } else {
            return res.status(200).json({
                message: 'Jeux trouvés',
                gameData: gameFilters
            });
        }
    }

    if (genreDemande) {
        const gameFilters = games.filter(jeu => {
            return jeu.caracteristiques.genre === genreDemande;
        });

        if (gameFilters.length === 0) {
            return res.status(404).json({
                message: 'Aucun jeu introuvable pour ce genre'
            });
        } else {
            return res.status(200).json({
                message: 'Jeux trouvés',
                gameData: gameFilters
            });
        }
    }

    if (prixMax) {
        const prixMaximum = parseFloat(prixMax);

        const gameFilters = games.filter(jeu => {
            return jeu.prix <= prixMaximum;
        });

        if (gameFilters.length === 0) {
            return res.status(404).json({
                message: 'Aucun jeu introuvable en dessous de ce prix'
            });
        } else {
            return res.status(200).json({
                message: 'Jeux trouvés',
                gameData: gameFilters
            });
        }
    }
    res.status(200).json({
        message: 'Catalogue complet',

    return res.status(200).json({
        message: 'Tous les jeux',
        gameData: games
    });
}

const getGameById = (req, res) => {
    const idDemande = req.params.id;
    
    const game = games.find(jeu => jeu.id === idDemande);
    
    if (!game) {
        res.status(404).json({
            message: 'Jeu introuvable'
        });
    } else {
        res.status(200).json({
            message: 'Jeu trouvé',
            gameData: game
        });
    }
}

// --- NOUVELLE FONCTION POUR GÉRER L'ACHAT ET LE STOCK ---
const buyGame = (req, res) => {
    // 1. On récupère l'ID du jeu depuis l'URL (ex: GAME-001)
    const idDemande = req.params.id;

    // 2. On cherche le jeu dans notre tableau
    const game = games.find(jeu => jeu.id === idDemande);

    // 3. Sécurité : Si le jeu n'existe pas, on arrête tout et on renvoie une erreur 404
    if (!game) {
        return res.status(404).json({ message: 'Jeu introuvable' });
    }

    // 4. Sécurité : On vérifie s'il reste du stock (quantité strictement supérieure à 0)
    // Si ce n'est pas le cas, on refuse la vente (Statut 400 = Mauvaise requête)
    if (game.quantite <= 0) {
        return res.status(400).json({ message: 'Rupture de stock pour ce jeu' });
    }

    // 5. La modification : On enlève 1 à la quantité du jeu
    game.quantite = game.quantite - 1;

    // 6. La sauvegarde physique : On prépare le chemin d'accès vers le fichier games.json
    // __dirname donne le dossier actuel, et on indique de remonter dans le dossier "data"
    const cheminFichier = path.join(__dirname, '../data/games.json');
    
    // 7. On écrase l'ancien fichier avec les nouvelles données
    // JSON.stringify avec (games, null, 2) permet de réécrire le fichier de manière propre et indentée
    fs.writeFileSync(cheminFichier, JSON.stringify(games, null, 2));

    // 8. On répond au client (ou à Postman) que l'opération est un succès
    return res.status(200).json({
        message: 'Achat réussi !',
        stockRestant: game.quantite,
        gameData: game
    });
}

module.exports = { getAllGames, getGameById, buyGame }