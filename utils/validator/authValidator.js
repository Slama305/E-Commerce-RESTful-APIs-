const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
exports.signupValidator = [
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

    validatorMiddleware
];
exports.loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    check('password')
        .notEmpty()
        .withMessage('Password is required'),
    validatorMiddleware
];