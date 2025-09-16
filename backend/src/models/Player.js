const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim alanı zorunludur'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Pozisyon alanı zorunludur'],
    enum: ['Kaleci', 'Defans', 'Orta Saha', 'Forvet']
  },
  number: {
    type: Number,
    required: [true, 'Forma numarası zorunludur'],
    min: [1, 'Forma numarası 1\'den küçük olamaz'],
    max: [99, 'Forma numarası 99\'dan büyük olamaz'],
    unique: true
  },
  birthDate: {
    type: Date,
    required: [true, 'Doğum tarihi zorunludur']
  },
  nationality: {
    type: String,
    default: 'TR'
  },
  height: {
    type: Number,
    default: 170
  },
  weight: {
    type: Number,
    default: 70
  },
  image: {
    type: String,
    default: '/player-placeholder.jpg'
  },
  stats: {
    matches: {
      type: Number,
      default: 0
    },
    goals: {
      type: Number,
      default: 0
    },
    assists: {
      type: Number,
      default: 0
    },
    yellowCards: {
      type: Number,
      default: 0
    },
    redCards: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
});

// Resim boyutunu kontrol eden middleware
playerSchema.pre('save', function(next) {
  if (this.image && this.image.startsWith('data:image') && this.image.length > 5 * 1024 * 1024) {
    next(new Error('Resim boyutu 5MB\'dan büyük olamaz'));
  }
  next();
});

module.exports = mongoose.model('Player', playerSchema); 