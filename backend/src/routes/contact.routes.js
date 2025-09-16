const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// İletişim rotaları
router.post('/send', contactController.sendMessage);
router.get('/messages', contactController.getAllMessages);
router.get('/messages/:id', contactController.getMessageById);
router.delete('/messages/:id', contactController.deleteMessage);

module.exports = router; 