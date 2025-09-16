const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Hakkımızda'
  },
  content: {
    type: String,
    required: true,
    default: 'Football School hakkında bilgi...'
  },
  trainers: [{
    name: String,
    position: String,
    image: String,
    qualification: String
  }],
  heroImage: {
    type: String,
    default: '/about-hero.jpg'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('About', aboutSchema); 