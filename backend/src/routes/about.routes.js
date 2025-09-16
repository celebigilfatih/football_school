const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/about.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', aboutController.getAbout);

// Protected routes (admin only)
router.put('/', auth, isAdmin, aboutController.updateAbout);
router.post('/trainers', auth, isAdmin, aboutController.addTrainer);
router.put('/trainers/:trainerId', auth, isAdmin, aboutController.updateTrainer);
router.delete('/trainers/:trainerId', auth, isAdmin, aboutController.deleteTrainer);

module.exports = router; 