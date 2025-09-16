const Contact = require('../models/Contact');

// İletişim formu mesajı gönder
exports.sendMessage = async (req, res) => {
  try {
    const message = new Contact(req.body);
    const savedMessage = await message.save();
    
    // Burada e-posta gönderme işlemi eklenebilir
    // await sendEmail(req.body);

    res.status(201).json({
      message: 'Mesajınız başarıyla gönderildi',
      data: savedMessage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Tüm mesajları getir (Admin için)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ID'ye göre mesaj getir (Admin için)
exports.getMessageById = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mesaj sil (Admin için)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }
    res.status(200).json({ message: 'Mesaj başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 