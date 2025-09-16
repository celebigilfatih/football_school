const Player = require('../models/Player');

// Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    console.log('Getting all players...');
    const players = await Player.find({ isActive: true })
      .sort({ number: 1 });
    console.log(`Found ${players.length} players`);
    res.status(200).json(players);
  } catch (error) {
    console.error('Error in getAllPlayers:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Oyuncu bulunamadı' });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get players by position
exports.getPlayersByPosition = async (req, res) => {
  try {
    const players = await Player.find({
      position: req.params.position,
      isActive: true
    }).sort({ number: 1 });
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new player
exports.createPlayer = async (req, res) => {
  try {
    // Check if jersey number is already taken
    const existingPlayer = await Player.findOne({ number: req.body.number });
    if (existingPlayer) {
      return res.status(400).json({ message: 'Bu forma numarası zaten kullanımda' });
    }

    const player = new Player({
      ...req.body,
      stats: {
        matches: req.body.stats?.matches || 0,
        goals: req.body.stats?.goals || 0,
        assists: req.body.stats?.assists || 0,
        yellowCards: req.body.stats?.yellowCards || 0,
        redCards: req.body.stats?.redCards || 0
      }
    });

    const savedPlayer = await player.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    console.error('Error in createPlayer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Oyuncu oluşturulurken bir hata oluştu' });
  }
};

// Update player
exports.updatePlayer = async (req, res) => {
  try {
    // Check if jersey number is already taken by another player
    if (req.body.number) {
      const existingPlayer = await Player.findOne({
        number: req.body.number,
        _id: { $ne: req.params.id }
      });
      if (existingPlayer) {
        return res.status(400).json({ message: 'Bu forma numarası zaten kullanımda' });
      }
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        stats: {
          ...req.body.stats,
          matches: req.body.stats?.matches || 0,
          goals: req.body.stats?.goals || 0,
          assists: req.body.stats?.assists || 0,
          yellowCards: req.body.stats?.yellowCards || 0,
          redCards: req.body.stats?.redCards || 0
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: 'Oyuncu bulunamadı' });
    }
    res.status(200).json(updatedPlayer);
  } catch (error) {
    console.error('Error in updatePlayer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Oyuncu güncellenirken bir hata oluştu' });
  }
};

// Delete player
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Oyuncu bulunamadı' });
    }
    res.status(200).json({ message: 'Oyuncu başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 