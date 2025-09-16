const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  category: {
    type: String,
    enum: ['Genel', 'Turnuva', 'Eğitim', 'Başarı', 'Diğer'],
    default: 'Genel'
  },
  author: {
    type: String,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }]
});

module.exports = mongoose.model('News', newsSchema); 