const express = require ('express')

const router = express.Router()

const gamecontroller = require ('../controllers/gameController')

router.get('/', gamecontroller.getAllGames)

<<<<<<< HEAD
router.get('/:id', gamecontroller.getGamesID)
=======
router.get('/:id', gamecontroller.getGameById)
>>>>>>> 2b77ac59168e56dfca07170a58c20e161be9abc1

module.exports = router;