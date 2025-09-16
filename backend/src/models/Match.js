const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  homeTeam: {
    type: String,
    required: [true, 'Ev sahibi takım gereklidir']
  },
  awayTeam: {
    type: String,
    required: [true, 'Deplasman takımı gereklidir'],
    validate: {
      validator: function(v) {
        return v !== this.homeTeam;
      },
      message: props => `Aynı takımlar birbiriyle oynayamaz!`
    }
  },
  date: {
    type: Date,
    required: [true, 'Maç tarihi gereklidir']
  },
  time: {
    type: String,
    required: [true, 'Maç saati gereklidir']
  },
  location: {
    type: String,
    required: [true, 'Maç yeri gereklidir']
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  score: {
    homeTeam: {
      type: Number,
      min: 0
    },
    awayTeam: {
      type: Number,
      min: 0
    }
  }
}, {
  timestamps: true
});

// Prevent same teams from playing against each other
matchSchema.pre('save', function(next) {
  if (this.homeTeam === this.awayTeam) {
    next(new Error('Ev sahibi ve deplasman takımları aynı olamaz'));
  }
  next();
});

module.exports = mongoose.model('Match', matchSchema); 