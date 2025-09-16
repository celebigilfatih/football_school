const Announcement = require('../models/Announcement');

// Tüm duyuruları getir
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ID'ye göre duyuru getir
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Duyuru bulunamadı' });
    }
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni duyuru oluştur
exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    const savedAnnouncement = await announcement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Duyuru güncelle
exports.updateAnnouncement = async (req, res) => {
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: 'Duyuru bulunamadı' });
    }
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Duyuru sil
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Duyuru bulunamadı' });
    }
    res.status(200).json({ message: 'Duyuru başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 