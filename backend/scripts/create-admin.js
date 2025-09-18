require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

const createAdmin = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football_school');
    console.log('MongoDB bağlantısı başarılı');

    // Varsayılan admin bilgileri
    const adminData = {
      username: 'ounal',
      password: 'ou+-2018',
      name: 'Ounal Yönetici',
      email: 'ounal@footballschool.com',
      role: 'admin',
      isActive: true
    };

    // Eğer admin kullanıcısı yoksa oluştur
    const existingAdmin = await Admin.findOne({ username: adminData.username });
    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut');
      process.exit(0);
    }

    const admin = new Admin(adminData);
    await admin.save();

    console.log('Admin kullanıcısı başarıyla oluşturuldu');
    console.log('Kullanıcı adı:', adminData.username);
    console.log('Şifre:', adminData.password);
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();