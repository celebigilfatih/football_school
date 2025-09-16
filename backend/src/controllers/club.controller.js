const Club = require('../models/Club');

// Kulüp bilgilerini getir
exports.getClubInfo = async (req, res) => {
  try {
    // Önbelleği devre dışı bırak
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Veritabanında sadece bir kulüp kaydı olacağı için ilk kaydı alıyoruz
    let club = await Club.findOne();
    
    // Eğer kayıt yoksa, varsayılan değerlerle yeni bir kayıt oluştur
    if (!club) {
      club = new Club();
      await club.save();
    }
    
    res.status(200).json(club);
  } catch (error) {
    console.error("getClubInfo hatası:", error);
    res.status(500).json({ message: error.message });
  }
};

// Kulüp bilgilerini güncelle (admin only)
exports.updateClubInfo = async (req, res) => {
  try {
    // Önbelleği devre dışı bırak
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    console.log("updateClubInfo çağrıldı");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    
    // Veritabanında sadece bir kulüp kaydı olacağı için ilk kaydı alıyoruz
    let club = await Club.findOne();
    
    // Eğer kayıt yoksa, varsayılan değerlerle yeni bir kayıt oluştur
    if (!club) {
      club = new Club();
    }
    
    // Gelen verileri güncelle
    const updates = req.body;
    console.log("Güncellenecek alanlar:", Object.keys(updates));
    
    // Temel alanları güncelle
    if (updates.name) club.name = updates.name;
    if (updates.address) club.address = updates.address;
    if (updates.phone) club.phone = updates.phone;
    if (updates.email) club.email = updates.email;
    
    // Sosyal medya alanlarını güncelle
    // socialMedia.facebook gibi dot notation ile gelen alanlar
    Object.keys(updates).forEach(key => {
      if (key.startsWith('socialMedia.')) {
        const socialKey = key.split('.')[1];
        club.socialMedia[socialKey] = updates[key];
      }
    });
    
    // Logo dosyası varsa güncelle
    if (req.file) {
      console.log("Logo dosyası güncelleniyor:", req.file.filename);
      // Logo dosyasının yolunu /uploads/ ile başlat (frontend'in erişebileceği şekilde)
      club.logo = `/uploads/${req.file.filename}`;
    }
    
    // Güncelleme tarihini ayarla
    club.updatedAt = new Date();
    
    // Kaydı güncelle
    await club.save();
    console.log("Kulüp bilgileri güncellendi:", club);
    
    res.status(200).json({
      message: 'Kulüp bilgileri başarıyla güncellendi',
      club
    });
  } catch (error) {
    console.error("updateClubInfo hatası:", error);
    res.status(400).json({ message: error.message });
  }
}; 