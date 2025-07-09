const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 32 })
    .withMessage('Category name must be between 3 and 32 characters long'),
  validatorMiddleware
];

exports.getCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid category ID format'),
  validatorMiddleware
];

exports.updateCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid category ID format'),
  check('name')
    .optional()
    .notEmpty()
    .withMessage('Category name cannot be empty')
    .isLength({ min: 3, max: 32 })
    .withMessage('Category name must be between 3 and 32 characters long'),
  validatorMiddleware
];

exports.deleteCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid category ID format'),
  validatorMiddleware
];



