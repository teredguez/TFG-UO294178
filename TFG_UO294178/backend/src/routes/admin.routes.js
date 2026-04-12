const express = require('express');
const adminController = require('../controllers/admin.controller');
const { requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/invite', requireAdmin, adminController.inviteUser);

module.exports = router;