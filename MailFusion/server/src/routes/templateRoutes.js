const express = require('express');
const { body } = require('express-validator');
const {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/templateController');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', getTemplates);
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Template name required'),
    body('subject').notEmpty().withMessage('Subject required'),
    body('body').notEmpty().withMessage('Body required'),
  ],
  validate,
  createTemplate
);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

module.exports = router;
