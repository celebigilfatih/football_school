const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const groupRoutes = require('./group.routes');
const teamsRoutes = require('./teams.routes');
const newsRoutes = require('./news.routes');
const announcementRoutes = require('./announcement.routes');
const contactRoutes = require('./contact.routes');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/groups', groupRoutes);
  app.use('/api/teams', teamsRoutes);
  app.use('/api/news', newsRoutes);
  app.use('/api/announcements', announcementRoutes);
  app.use('/api/contact', contactRoutes);
};