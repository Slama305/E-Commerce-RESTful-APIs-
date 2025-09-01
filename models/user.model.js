const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
            trim: true
        },
        slug : {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        phone : String,
        profileImage : {
            type: String,
            default: 'https://example.com/default-profile.png'
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,
        role: {
            type: String,
            enum: ['user', 'admin' , 'manager'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true}
);
// pre-save middleware to create slug from name
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;