const User = require('../models/user.model');
const Factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const JWT = require("jsonwebtoken");

const createToken = (payload) => {
     return JWT.sign({ id: payload }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}
// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Private (Admin)
const createUser = Factory.createOne(User);
// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
const getAllUsers = Factory.getAll(User);
// @desc    Get a user by ID
// @route   GET /api/v1/users/:id
// @access  Public
const getUserById = Factory.getOne(User);
// @desc    Update a user
// @route   PUT /api/v1/users/:id
// @access  Private (Admin)
const updateUser = asyncHandler(async (req, res, next) => {
    if (req.body.name) {
        req.body.slug = slugify(req.body.name);
    }
    if (req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
        // password: req.body.password, // Note: Password should be hashed in the model pre-save hook
        role: req.body.role,
        isActive: req.body.isActive
    }, {
        new: true,
        runValidators: true
    });
    if (!updatedUser) {
        return next(new ApiError(`No user found with ID ${req.params.id}`, 404));
    }
    res.status(200).json({ data: updatedUser });
});

const bcrypt = require('bcryptjs');
// @desc    Update user password
const updateUserPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id , 
        {
            password: await bcrypt.hash(req.body.password, 10),
            passwordChangedAt: Date.now()
        },
        {
            new: true,
            runValidators: true
        });
        if (!user) {
            return next(new ApiError(`No user found with ID ${req.params.id}`, 404));
        }
        res.status(200).json({ data: user });
    });

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
const deleteUser = Factory.deleteOne(User);
// @desc    Get me
// @route   GET /api/v1/users/getMe
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
   req.params.id = req.user._id;
   next();
});
// @desc     put password
// @route   PUT /api/v1/users/getMe/password
// @access  Private
const updateMePassword = asyncHandler(async (req, res, next) => {
    const user =  await User.findByIdAndUpdate(req.user._id , 
        {
            password: await bcrypt.hash(req.body.password, 10),
            passwordChangedAt: Date.now()
        },
        {
            new: true,
            runValidators: true
        });
        if (!user) {
            return next(new ApiError(`No user found with ID ${req.params.id}`, 404));
        }
        const token = createToken(user._id);
        res.status(200).json({ data: user, token });
    });
// @desc     put data user
// @route   PUT /api/v1/users/userdata
// @access  Private
const updateUserData = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        name : req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
       
    }, {
        new: true,
        runValidators: true
    });
    if (!user) {
        return next(new ApiError(`No user found with ID ${req.user._id}`, 404));
    }
    res.status(200).json({ data: user });
});
// @desc     delete data user
// @route   DELETE /api/v1/users/userdata
// @access  Private
const deleteUserData = asyncHandler(async (req, res, next) => {
     await User.findByIdAndUpdate(req.user._id , {
        active: false
    });
   
    res.status(204).json();
});

// Export the controller functions
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    updateUserPassword,
    deleteUser,
    getMe,
    updateMePassword,
    updateUserData,
    deleteUserData
};