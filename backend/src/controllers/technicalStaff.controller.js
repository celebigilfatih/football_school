const TechnicalStaff = require('../models/TechnicalStaff');

// Get all technical staff members
exports.getAllStaff = async (req, res) => {
  try {
    console.log('Getting all technical staff members...');
    const staff = await TechnicalStaff.find({ isActive: true })
      .sort({ position: 1 });
    console.log(`Found ${staff.length} staff members`);
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error in getAllStaff:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get staff member by ID
exports.getStaffById = async (req, res) => {
  try {
    console.log('Getting staff member by ID:', req.params.id);
    const staff = await TechnicalStaff.findById(req.params.id);
    if (!staff) {
      console.log('Staff member not found');
      return res.status(404).json({ message: 'Teknik ekip üyesi bulunamadı' });
    }
    console.log('Staff member found:', staff);
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error in getStaffById:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new staff member
exports.createStaff = async (req, res) => {
  try {
    console.log('Creating new staff member with data:', req.body);
    
    const staff = new TechnicalStaff({
      name: req.body.name,
      position: req.body.position,
      qualification: req.body.qualification,
      experience: req.body.experience || 0,
      biography: req.body.biography || '',
      image: req.body.image || '/staff-placeholder.jpg',
      isActive: true,
      joinDate: new Date()
    });

    const savedStaff = await staff.save();
    console.log('Staff member created successfully:', savedStaff);
    res.status(201).json(savedStaff);
  } catch (error) {
    console.error('Error in createStaff:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validasyon hatası',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Teknik ekip üyesi oluşturulurken bir hata oluştu' });
  }
};

// Update staff member
exports.updateStaff = async (req, res) => {
  try {
    console.log('Updating staff member with ID:', req.params.id);
    console.log('Update data:', req.body);

    // Validate required fields
    if (!req.body.name || !req.body.position || !req.body.qualification) {
      return res.status(400).json({ 
        message: 'Ad, pozisyon ve yeterlilik alanları zorunludur' 
      });
    }

    // Prepare update data
    const updateData = {
      name: req.body.name,
      position: req.body.position,
      qualification: req.body.qualification,
      experience: req.body.experience || 0,
      biography: req.body.biography || '',
      isActive: req.body.isActive
    };

    // Only update image if a new one is provided
    if (req.body.image && req.body.image !== '/staff-placeholder.jpg') {
      updateData.image = req.body.image;
    }

    const updatedStaff = await TechnicalStaff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      console.log('Staff member not found for update');
      return res.status(404).json({ message: 'Teknik ekip üyesi bulunamadı' });
    }

    console.log('Staff member updated successfully:', updatedStaff);
    res.status(200).json(updatedStaff);
  } catch (error) {
    console.error('Error in updateStaff:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validasyon hatası',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Geçersiz ID formatı'
      });
    }
    res.status(500).json({ 
      message: 'Teknik ekip üyesi güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Delete staff member
exports.deleteStaff = async (req, res) => {
  try {
    console.log('Deleting staff member with ID:', req.params.id);
    const staff = await TechnicalStaff.findByIdAndDelete(req.params.id);
    if (!staff) {
      console.log('Staff member not found for deletion');
      return res.status(404).json({ message: 'Teknik ekip üyesi bulunamadı' });
    }
    console.log('Staff member deleted successfully');
    res.status(200).json({ message: 'Teknik ekip üyesi başarıyla silindi' });
  } catch (error) {
    console.error('Error in deleteStaff:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get staff by position
exports.getStaffByPosition = async (req, res) => {
  try {
    console.log('Getting staff by position:', req.params.position);
    const staff = await TechnicalStaff.find({ 
      position: req.params.position,
      isActive: true 
    });
    console.log(`Found ${staff.length} staff members for position:`, req.params.position);
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error in getStaffByPosition:', error);
    res.status(500).json({ message: error.message });
  }
}; 