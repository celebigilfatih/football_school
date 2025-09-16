const News = require('../models/News');

// Tüm haberleri getir
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find({ isPublished: true })
      .sort({ publishDate: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ID'ye göre haber getir
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'Haber bulunamadı' });
    }
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni haber oluştur
exports.createNews = async (req, res) => {
  try {
    // Validate required fields
    const { title, content, author, category } = req.body;
    
    if (!title || !content || !author) {
      return res.status(400).json({ 
        message: 'Başlık, içerik ve yazar alanları zorunludur' 
      });
    }

    // Check if image is too large (max 5MB)
    if (req.body.image) {
      const base64Size = Buffer.from(req.body.image.split(',')[1], 'base64').length;
      if (base64Size > 5 * 1024 * 1024) {
        return res.status(400).json({ 
          message: 'Görsel boyutu çok büyük (maksimum 5MB)' 
        });
      }
    }

    // Create news with validated data
    const newsData = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: category || 'Genel',
      image: req.body.image,
      isPublished: req.body.isPublished ?? true,
      publishDate: new Date(req.body.publishDate || Date.now()),
      tags: Array.isArray(req.body.tags) ? req.body.tags.filter(tag => tag.trim()) : []
    };

    const news = new News(newsData);
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ 
      message: 'Haber oluşturulurken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Haber güncelle
exports.updateNews = async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedNews) {
      return res.status(404).json({ message: 'Haber bulunamadı' });
    }
    res.status(200).json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Haber sil
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'Haber bulunamadı' });
    }
    res.status(200).json({ message: 'Haber başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 