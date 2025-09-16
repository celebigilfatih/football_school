const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Football School'
  },
  logo: {
    type: String,
    default: '/logo.png'
  },
  address: {
    type: String,
    required: true,
    default: 'Örnek Mahallesi, Spor Caddesi No:123, İstanbul'
  },
  phone: {
    type: String,
    required: true,
    default: '+90 212 123 45 67'
  },
  email: {
    type: String,
    required: true,
    default: 'info@footballschool.com'
  },
  socialMedia: {
    facebook: {
      type: String,
      default: 'https://facebook.com/footballschool'
    },
    instagram: {
      type: String,
      default: 'https://instagram.com/footballschool'
    },
    twitter: {
      type: String,
      default: 'https://twitter.com/footballschool'
    },
    whatsapp: {
      type: String,
      default: 'https://wa.me/902121234567'
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Club', clubSchema); 