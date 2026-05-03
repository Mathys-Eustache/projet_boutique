<<<<<<< HEAD

=======
>>>>>>> 2b77ac59168e56dfca07170a58c20e161be9abc1
const games = require("../data/games.json");

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

module.exports = { getAllGames, getGameById }