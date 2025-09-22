const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/about.controller');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('Multer error:', err);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.' });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Çok fazla dosya yüklendi.' });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Beklenmeyen dosya alanı.' });
    }
    
    if (err.message === 'Sadece resim dosyaları yüklenebilir!') {
      return res.status(400).json({ message: 'Sadece resim dosyaları (JPG, PNG, GIF) yüklenebilir.' });
    }
    
    return res.status(400).json({ message: err.message || 'Dosya yükleme hatası' });
  }
  next();
};

// Public routes
router.get('/', aboutController.getAbout);

// Protected routes (admin only)
router.put('/', auth, isAdmin, aboutController.updateAbout);
router.post('/trainers', auth, isAdmin, aboutController.addTrainer);
router.post('/trainers/upload', auth, isAdmin, upload.single('image'), handleMulterError, aboutController.addTrainerWithImage);
router.put('/trainers/:trainerId', auth, isAdmin, aboutController.updateTrainer);
router.put('/trainers/:trainerId/upload', auth, isAdmin, upload.single('image'), handleMulterError, aboutController.updateTrainerWithImage);
router.delete('/trainers/:trainerId', auth, isAdmin, aboutController.deleteTrainer);

module.exports = router;