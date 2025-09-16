const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);

// Protected routes (admin only)
router.post('/', auth, isAdmin, groupController.createGroup);
router.put('/:id', auth, isAdmin, groupController.updateGroup);
router.delete('/:id', auth, isAdmin, groupController.deleteGroup);

module.exports = router; 