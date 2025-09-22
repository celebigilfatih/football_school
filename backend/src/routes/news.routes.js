const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Protected routes (admin only)
router.post('/', auth, isAdmin, newsController.createNews);
router.put('/:id', auth, isAdmin, newsController.updateNews);
router.delete('/:id', auth, isAdmin, newsController.deleteNews);

module.exports = router;