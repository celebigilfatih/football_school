require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

const checkAdmins = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football_school');
    console.log('MongoDB bağlantısı başarılı');

    // Tüm admin kullanıcılarını listele
    const admins = await Admin.find({});
    
    if (admins.length === 0) {
      console.log('Veritabanında hiç admin kullanıcısı bulunamadı');
    } else {
      console.log(`Toplam ${admins.length} admin kullanıcısı bulundu:`);
      console.log('='.repeat(50));
      
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Admin:`);
        console.log(`   ID: ${admin._id}`);
        console.log(`   Kullanıcı Adı: ${admin.username}`);
        console.log(`   İsim: ${admin.name}`);
        console.log(`   E-posta: ${admin.email}`);
        console.log(`   Rol: ${admin.role}`);
        console.log(`   Aktif: ${admin.isActive ? 'Evet' : 'Hayır'}`);
        console.log(`   Oluşturulma: ${admin.createdAt}`);
        console.log(`   Son Güncelleme: ${admin.updatedAt}`);
        if (admin.lastLogin) {
          console.log(`   Son Giriş: ${admin.lastLogin}`);
        }
        console.log('-'.repeat(30));
      });
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkAdmins();