const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');

// Get all matches
router.get('/', matchController.getAllMatches);

// Get upcoming matches
router.get('/upcoming', matchController.getUpcomingMatches);

// Get match by ID
router.get('/:id', matchController.getMatchById);

// Create new match
router.post('/', matchController.createMatch);

// Update match
router.put('/:id', matchController.updateMatch);

// Delete match
router.delete('/:id', matchController.deleteMatch);

module.exports = router; 