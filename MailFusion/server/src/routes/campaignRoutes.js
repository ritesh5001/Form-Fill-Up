const express = require('express');
const { getCampaigns, getCampaignById } = require('../controllers/campaignController');

const router = express.Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);

module.exports = router;
