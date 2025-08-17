const express = require('express');
const contentController = require('../controllers/contentController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, contentController.createContent);
router.get('/', verifyToken, contentController.getContentList);
router.put('/:id/approve', verifyToken, requireRole('admin'), contentController.approveContent);
router.put('/:id/reject', verifyToken, requireRole('admin'), contentController.rejectContent);
router.get('/stats',verifyToken,requireRole('admin'),contentController.contentstats);
router.get('/search',verifyToken,requireRole('admin'),contentController.search);
router.get('/recent',verifyToken,requireRole('admin'),contentController.recent);

module.exports = router;

