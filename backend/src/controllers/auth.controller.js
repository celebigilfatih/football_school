const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: 'Hesabınız devre dışı bırakılmış' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Send response
    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Giriş yapılırken bir hata oluştu' });
  }
};

// Get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Yönetici bulunamadı' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mevcut şifre yanlış' });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: 'Şifre başarıyla değiştirildi' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all admins (super admin only)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin by ID (super admin only)
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Yönetici bulunamadı' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register new admin (public endpoint)
exports.register = async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    // Validation
    if (!username || !password || !name || !email) {
      return res.status(400).json({
        message: 'Tüm alanlar zorunludur'
      });
    }

    // Check if username or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: 'Bu kullanıcı adı veya e-posta adresi zaten kullanılıyor'
      });
    }

    const admin = new Admin({
      username,
      password,
      name,
      email,
      role: 'editor', // Default role for new registrations
      isActive: true
    });

    await admin.save();

    res.status(201).json({
      message: 'Kayıt başarıyla tamamlandı',
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create new admin (super admin only)
exports.createAdmin = async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;

    // Check if username or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: 'Bu kullanıcı adı veya e-posta adresi zaten kullanılıyor'
      });
    }

    const admin = new Admin({
      username,
      password,
      name,
      email,
      role: role || 'editor'
    });

    await admin.save();

    res.status(201).json({
      message: 'Yönetici başarıyla oluşturuldu',
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update admin (super admin only)
exports.updateAdmin = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Password can't be updated through this endpoint

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Yönetici bulunamadı' });
    }

    res.status(200).json({
      message: 'Yönetici başarıyla güncellendi',
      admin
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete admin (super admin only)
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Yönetici bulunamadı' });
    }
    res.status(200).json({ message: 'Yönetici başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};