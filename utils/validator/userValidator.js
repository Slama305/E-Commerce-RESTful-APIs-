const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
exports.createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 32 })
        .withMessage('Name must be between 3 and 32 characters long')
        .custom((value , {req}) => {
            req.body.slug = value.toLowerCase().split(' ').join('-');
            return true;
        }),
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .isLength({ max: 64 })
        .withMessage('Email must be at most 64 characters long')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    check('phone')
        .optional()
        .isMobilePhone([
            'any', 'en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'it-IT', 'ar-EG'
        ])
        .withMessage('Invalid phone number format'),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    check('passwordConfirmation')
        .notEmpty()
        .withMessage('Password confirmation is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    check('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),
    check('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value'),
    validatorMiddleware
];
exports.getUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid user ID format'),
    validatorMiddleware
];

exports.updateUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid user ID format'),
    check('name')
        .optional()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 3, max: 32 })
        .withMessage('Name must be between 3 and 32 characters long')
        .custom((value, { req }) => {
            req.body.slug = value.toLowerCase().split(' ').join('-');
            return true;
        }
    ),
    check('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format')
        .isLength({ max: 64 })
        .withMessage('Email must be at most 64 characters long')
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value });
            if (user && user._id.toString() !== req.params.id) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    check('phone')
        .optional()
        .isMobilePhone([
            'any', 'en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'it-IT', 'ar-EG'
        ])
        .withMessage('Invalid phone number format'),
    check('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    check('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),
    check('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value'),
    validatorMiddleware
];
exports.deleteUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid user ID format'),
    validatorMiddleware
];

exports.updateUserPasswordValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid user ID format'),
    check('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    check('confirmNewPassword')
        .notEmpty()
        .withMessage('Confirm new password is required'),
   
    check('password')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
          .custom(async(value, { req }) => {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error(`No user found with ID ${req.params.id}`);
            }
            const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }

           if (value !== req.body.confirmNewPassword) {
                throw new Error('New password confirmation does not match new password');
            }
            return true;
        }),
     validatorMiddleware
];
