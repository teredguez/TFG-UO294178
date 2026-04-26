const express = require('express');
const upload = require('../middlewares/upload.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const { createReport, getMyReports, viewReport, getProfileActivity,
    saveDraft,getDrafts,getDraftById,completeDraft,deleteDraft} = require('../controllers/report.controller');

const router = express.Router();

router.post('/', requireAuth, upload.single('pdf'), createReport);
router.get('/', requireAuth, getMyReports);

router.post('/drafts', requireAuth, saveDraft);
router.get('/drafts', requireAuth, getDrafts);
router.get('/drafts/:id', requireAuth, getDraftById);
router.put('/drafts/:id/complete', requireAuth, upload.single('pdf'), completeDraft);
router.delete('/drafts/:id', requireAuth, deleteDraft);

router.get('/profile/activity', requireAuth, getProfileActivity);
router.get('/:id/view', requireAuth, viewReport);

module.exports = router;