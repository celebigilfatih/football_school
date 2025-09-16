const Match = require('../models/Match');

// Get all matches
exports.getAllMatches = async (req, res) => {
  try {
    console.log('Getting all matches...');
    const matches = await Match.find().sort({ date: 1, time: 1 });
    console.log(`Found ${matches.length} matches`);
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error in getAllMatches:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get upcoming matches
exports.getUpcomingMatches = async (req, res) => {
  try {
    console.log('Getting upcoming matches...');
    
    // Bugünün başlangıcını al (saat 00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log('Today date:', today);
    
    // Eğer hiç maç yoksa, örnek maçlar oluştur
    const count = await Match.countDocuments();
    console.log(`Total matches in database: ${count}`);
    
    if (count === 0) {
      console.log('No matches found, creating sample matches...');
      
      // Örnek maçlar
      const sampleMatches = [
        {
          homeTeam: 'Futbol Okulu A',
          awayTeam: 'Rakip Takım B',
          date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 gün sonra
          time: '15:00',
          location: 'Ana Stadyum',
          status: 'scheduled'
        },
        {
          homeTeam: 'Futbol Okulu U19',
          awayTeam: 'Şehir Spor',
          date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 gün sonra
          time: '17:30',
          location: 'Yan Saha',
          status: 'scheduled'
        },
        {
          homeTeam: 'Rakip Takım C',
          awayTeam: 'Futbol Okulu U17',
          date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 gün sonra
          time: '14:00',
          location: 'Deplasman Sahası',
          status: 'scheduled'
        }
      ];
      
      // Örnek maçları kaydet
      await Match.insertMany(sampleMatches);
      console.log('Sample matches created successfully');
    }

    // Tarihi string olarak değil, Date objesi olarak karşılaştır
    const matches = await Match.find({
      date: { $gte: today },
      status: 'scheduled'
    })
    .sort({ date: 1, time: 1 })
    .limit(5);

    console.log(`Found ${matches.length} upcoming matches`);
    console.log('Upcoming matches:', JSON.stringify(matches, null, 2));

    res.status(200).json(matches);
  } catch (error) {
    console.error('Error in getUpcomingMatches:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get match by ID
exports.getMatchById = async (req, res) => {
  try {
    console.log(`Getting match with ID: ${req.params.id}`);
    const match = await Match.findById(req.params.id);
    if (!match) {
      console.log(`Match with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Maç bulunamadı' });
    }
    console.log('Match found:', match);
    res.status(200).json(match);
  } catch (error) {
    console.error(`Error in getMatchById for ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// Create new match
exports.createMatch = async (req, res) => {
  try {
    console.log('Creating new match with data:', req.body);
    const match = new Match(req.body);
    const savedMatch = await match.save();
    console.log('Match created successfully:', savedMatch);
    res.status(201).json(savedMatch);
  } catch (error) {
    console.error('Error in createMatch:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update match
exports.updateMatch = async (req, res) => {
  try {
    console.log(`Updating match with ID ${req.params.id} with data:`, req.body);
    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMatch) {
      console.log(`Match with ID ${req.params.id} not found for update`);
      return res.status(404).json({ message: 'Maç bulunamadı' });
    }
    console.log('Match updated successfully:', updatedMatch);
    res.status(200).json(updatedMatch);
  } catch (error) {
    console.error(`Error in updateMatch for ID ${req.params.id}:`, error);
    res.status(400).json({ message: error.message });
  }
};

// Delete match
exports.deleteMatch = async (req, res) => {
  try {
    console.log(`Deleting match with ID: ${req.params.id}`);
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      console.log(`Match with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({ message: 'Maç bulunamadı' });
    }
    console.log(`Match with ID ${req.params.id} deleted successfully`);
    res.status(200).json({ message: 'Maç başarıyla silindi' });
  } catch (error) {
    console.error(`Error in deleteMatch for ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
}; 