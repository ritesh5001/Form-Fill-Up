const express = require('express');
const multer = require('multer');
const { sendBulkEmail } = require('../controllers/bulkController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/send', upload.single('file'), sendBulkEmail);

module.exports = router;
