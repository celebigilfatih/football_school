const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['A Takım', 'Alt Yapı'],
    default: 'Alt Yapı'
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  ageRange: {
    min: {
      type: Number
    },
    max: {
      type: Number
    }
  },
  capacity: {
    type: Number
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  }],
  trainer: {
    name: {
      type: String,
      required: true
    },
    qualification: {
      type: String,
      required: true
    }
  },
  players: [{
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    birthDate: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true,
      enum: ['Kaleci', 'Defans', 'Orta Saha', 'Forvet']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Group', groupSchema); 