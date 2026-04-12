const express = require('express');
const upload = require('../middlewares/upload.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const { createReport, getMyReports , viewReport} = require('../controllers/report.controller');

const router = express.Router();

router.post('/', requireAuth, upload.single('pdf'), createReport);
router.get('/', requireAuth, getMyReports);
router.get('/:id/view', requireAuth, viewReport);

module.exports = router;