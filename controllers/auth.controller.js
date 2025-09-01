const crypto = require('crypto');
const User = require('../models/user.model');
const Factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const JWT = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const createToken = (payload) => {
     return JWT.sign({ id: payload }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}
exports.signup = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ApiError('User already exists', 400));
    }

    // Create new user
    const newUser = await User.create({
        name,
        email,
        password
    });

    // Generate JWT token
    const token = createToken(newUser._id);

    // Send response
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
            token
        }
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError('Invalid email or password', 401));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ApiError('Invalid email or password', 401));
    }

    // Generate JWT token
    const token = createToken(user._id);

    // Send response
    res.status(200).json({
        status: 'success',
        data: {
            user,
            token
        }
    });
});

exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    // Check if token is in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token, return error
    if (!token) return next(new ApiError('You are not logged in', 401));

    // Verify token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    // check if user exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) return next(new ApiError('User no longer exists', 401));
    
    // check password not change
    if(currentUser.passwordChangedAt){
        const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
        if(decoded.iat < changedTimestamp) return next(new ApiError('User recently changed password! Please log in again', 401));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();

});

exports.allowedTo = (...role) =>
     asyncHandler(async (req , res , next ) => {
      if(!role.includes(req.user.role)) {
          return next(new ApiError('You are not allowed to perform this action', 403));
      }
      next();
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError('User not found', 404));
    }

    // Generate hash reset code with 6 numbers
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
    user.passwordResetCode = hashedResetCode;

    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.passwordResetVerified = false;

    await user.save();

    // Send email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (valid for 10 minutes)',
            message: `Your password reset code is: ${resetCode}`,
        });
    } catch (error) {
        console.error("❌ Forgot password email error:", error);

        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();

        return next(new ApiError(`Error sending email: ${error.message}`, 500));
    }

    res.status(200).json({
        status: 'success',
        message: 'Reset code sent to email',
    });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
   const hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
   const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() }
   })
   if(!user){
    return next(new ApiError('Reset code Invalid or Expired'))
   }
    // Mark reset code as verified
    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Reset code verified successfully' });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email : req.body.email});
    if(!user){
        return next(new ApiError('User not found', 404));
    }
    if(!user.passwordResetVerified){
        return next(new ApiError('Reset code not verified', 403));
    }

    // Update user password
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    const token = createToken(user._id);
    res.status(200).json({ status: 'success', token });

});
