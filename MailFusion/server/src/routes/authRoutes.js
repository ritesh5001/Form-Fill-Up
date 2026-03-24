const express = require('express');
const { body } = require('express-validator');
const { register, login, logout } = require('../controllers/authController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ],
  validate,
  register
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, login);
router.post('/logout', auth, logout);

module.exports = router;
