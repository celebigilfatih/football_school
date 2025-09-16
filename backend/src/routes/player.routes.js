const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);
router.get('/position/:position', playerController.getPlayersByPosition);

// Protected routes (admin only)
router.post('/', auth, isAdmin, playerController.createPlayer);
router.put('/:id', auth, isAdmin, playerController.updatePlayer);
router.delete('/:id', auth, isAdmin, playerController.deletePlayer);

module.exports = router; 