const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const addressController = require('../controllers/addressController');

router.put('/address', [
  check('userId').isInt().withMessage('User ID must be a number'),
  check('street').notEmpty().withMessage('Street is required'),
  check('city').notEmpty().withMessage('City is required'),
  check('zip').notEmpty().withMessage('ZIP code is required'),
  check('country').notEmpty().withMessage('Country is required')
], addressController.updateAddress);

module.exports = router;