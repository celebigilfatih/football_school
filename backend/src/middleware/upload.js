const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Uploads klasörünü oluştur (eğer yoksa)
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Frontend uploads klasörünü oluştur (eğer yoksa)
const frontendUploadDir = path.join(__dirname, '../../../frontend/public/uploads');
if (!fs.existsSync(frontendUploadDir)) {
  fs.mkdirSync(frontendUploadDir, { recursive: true });
}

// Dosya depolama konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Dosya adını benzersiz yap
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
  // Sadece resim dosyalarını kabul et
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
  }
};

// Multer konfigürasyonu
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Dosyayı frontend'e kopyalama işlevi
const copyToFrontend = (req, res, next) => {
  if (!req.file) return next();
  
  const source = path.join(uploadDir, req.file.filename);
  const destination = path.join(frontendUploadDir, req.file.filename);
  
  fs.copyFile(source, destination, (err) => {
    if (err) {
      console.error('Dosya kopyalama hatası:', err);
      // Hata olsa bile işleme devam et
    } else {
      console.log(`Dosya frontend'e kopyalandı: ${req.file.filename}`);
    }
    next();
  });
};

// Middleware'i dışa aktar
module.exports = {
  single: (fieldName) => {
    return [upload.single(fieldName), copyToFrontend];
  }
}; 