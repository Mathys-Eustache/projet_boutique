const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');


router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);

router.patch('/:id/buy', gameController.buyGame);
router.get('/', gamecontroller.getAllGames)
router.get('/:id', gamecontroller.getGameById)

module.exports = router;