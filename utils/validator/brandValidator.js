const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 3, max: 32 })
    .withMessage('Brand name must be between 3 and 32 characters long'),
  validatorMiddleware
];
exports.getBrandValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid brand ID format'),
  validatorMiddleware
];
exports.updateBrandValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid brand ID format'),
  check('name')
    .optional()
    .notEmpty()
    .withMessage('Brand name cannot be empty')
    .isLength({ min: 3, max: 32 })
    .withMessage('Brand name must be between 3 and 32 characters long'),
  validatorMiddleware
];
exports.deleteBrandValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid brand ID format'),
  validatorMiddleware
];