<<<<<<< HEAD

=======
>>>>>>> 2b77ac59168e56dfca07170a58c20e161be9abc1
const games = require("../data/games.json");


const getAllGames = (req, res) => res.send(games)


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