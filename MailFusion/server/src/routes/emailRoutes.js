const express = require('express');
const { body } = require('express-validator');
const { sendSingleEmail } = require('../controllers/emailController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/send',
  [
    body('to').isEmail().withMessage('Valid recipient email is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  validate,
  sendSingleEmail
);

module.exports = router;
