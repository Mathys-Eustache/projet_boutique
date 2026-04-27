const express = require ('express')

const router = express.Router()

const gamecontroller = require ('../controllers/gameController')

router.get('/', gamecontroller.getAllGames)

router.get('/:id', gamecontroller.getGamesID)

module.exports = router;