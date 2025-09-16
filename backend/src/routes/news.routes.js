const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');

// Haber rotaları
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', newsController.createNews);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router; 