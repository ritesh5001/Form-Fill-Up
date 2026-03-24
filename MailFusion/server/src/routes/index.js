const express = require('express');
const auth = require('../middleware/auth');
const authRoutes = require('./authRoutes');
const emailRoutes = require('./emailRoutes');
const bulkRoutes = require('./bulkRoutes');
const templateRoutes = require('./templateRoutes');
const campaignRoutes = require('./campaignRoutes');
const historyRoutes = require('./historyRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const settingsRoutes = require('./settingsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/email', auth, emailRoutes);
router.use('/bulk', auth, bulkRoutes);
router.use('/templates', auth, templateRoutes);
router.use('/campaigns', auth, campaignRoutes);
router.use('/history', auth, historyRoutes);
router.use('/dashboard', auth, dashboardRoutes);
router.use('/settings', auth, settingsRoutes);

module.exports = router;
