const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 32 })
    .withMessage('Category name must be between 3 and 32 characters long'),
  check('category')
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Invalid category ID format'),
  validatorMiddleware
];

exports.getSubCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid category ID format'),
  validatorMiddleware
];

exports.updateSubCategoryValidator = [
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

exports.deleteSubCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid category ID format'),
  validatorMiddleware
];



