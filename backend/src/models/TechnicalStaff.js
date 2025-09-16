const mongoose = require('mongoose');

const technicalStaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ad Soyad alanı zorunludur'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Pozisyon alanı zorunludur'],
    enum: [
      'Teknik Direktör',
      'Yardımcı Antrenör',
      'Kaleci Antrenörü',
      'Kondisyoner',
      'Fizyoterapist',
      'Masör',
      'Malzemeci',
      'Analizci'
    ]
  },
  image: {
    type: String,
    default: '/staff-placeholder.jpg'
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

module.exports = mongoose.model('TechnicalStaff', technicalStaffSchema); 