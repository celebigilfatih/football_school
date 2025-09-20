const Group = require('../models/Group');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/groups';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Tüm resimleri JPEG formatında kaydet
    cb(null, uniqueSuffix + '.jpg');
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir.'));
    }
  }
}).single('image');

// Get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({ isActive: true });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get group by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Grup bulunamadı' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new group
exports.createGroup = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Dosya yükleme hatası' });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      let groupData;
      if (req.file) {
        // Convert image to JPEG format using Sharp
        const inputPath = req.file.path;
        const outputPath = req.file.path; // Same path since we already set .jpg extension
        
        await sharp(inputPath)
          .jpeg({ quality: 90 })
          .toFile(outputPath + '.temp');
        
        // Replace original file with converted JPEG
        fs.unlinkSync(inputPath);
        fs.renameSync(outputPath + '.temp', outputPath);
        
        // If there's an uploaded file
        groupData = JSON.parse(req.body.data);
        groupData.imageUrl = `/uploads/groups/${req.file.filename}`;
      } else {
        // If no file, just use the body data
        groupData = req.body;
      }

      console.log('Creating group with data:', groupData);

      const group = new Group(groupData);
      const savedGroup = await group.save();
      res.status(201).json(savedGroup);
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(400).json({ message: error.message });
    }
  });
};

// Update group
exports.updateGroup = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Dosya yükleme hatası' });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      let updateData;
      if (req.file) {
        // Convert image to JPEG format using Sharp
        const inputPath = req.file.path;
        const outputPath = req.file.path; // Same path since we already set .jpg extension
        
        await sharp(inputPath)
          .jpeg({ quality: 90 })
          .toFile(outputPath + '.temp');
        
        // Replace original file with converted JPEG
        fs.unlinkSync(inputPath);
        fs.renameSync(outputPath + '.temp', outputPath);
        
        // If there's an uploaded file
        updateData = JSON.parse(req.body.data);
        updateData.imageUrl = `/uploads/groups/${req.file.filename}`;

        // Delete old image if exists
        const oldGroup = await Group.findById(req.params.id);
        if (oldGroup && oldGroup.imageUrl) {
          const oldImagePath = path.join(__dirname, '../../', oldGroup.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      } else {
        // If no file, just use the body data
        updateData = req.body;
      }

      console.log('Updating group with data:', updateData);

      const updatedGroup = await Group.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedGroup) {
        return res.status(404).json({ message: 'Grup bulunamadı' });
      }

      res.status(200).json(updatedGroup);
    } catch (error) {
      console.error('Error updating group:', error);
      res.status(400).json({ message: error.message });
    }
  });
};

// Delete group
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Grup bulunamadı' });
    }

    // Delete associated image if exists
    if (group.imageUrl) {
      const imagePath = path.join(__dirname, '../../', group.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await group.deleteOne();
    res.status(200).json({ message: 'Grup başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};