const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club.controller');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route - Kulüp bilgilerini getir
router.get('/', clubController.getClubInfo);

// Protected route (admin only) - Kulüp bilgilerini güncelle
// Logo dosyası için 'logo' alanını kullanıyoruz
router.put('/', auth, isAdmin, upload.single('logo'), clubController.updateClubInfo);

module.exports = router; 