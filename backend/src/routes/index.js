const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const groupRoutes = require('./group.routes');
const newsRoutes = require('./news.routes');
const announcementRoutes = require('./announcement.routes');
const contactRoutes = require('./contact.routes');

// Auth rotaları
router.use('/auth', authRoutes);

// Diğer rotalar
router.use('/groups', groupRoutes);
router.use('/news', newsRoutes);
router.use('/announcements', announcementRoutes);
router.use('/contact', contactRoutes);

module.exports = router; 