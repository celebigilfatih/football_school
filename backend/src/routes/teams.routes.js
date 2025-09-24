const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');

// Teams routes - redirecting to groups since teams and groups are the same concept
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);

module.exports = router;