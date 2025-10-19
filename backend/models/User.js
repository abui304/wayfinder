// Defines user schema in database

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    personality: {
        activityFrequency: {
            type: String,
            enum: ['relaxed', 'moderate', 'packed'],
            default: 'moderate',
        },
        activityLevel: {
            type: String,
            enum: ['chill', 'moderate', 'active'],
            default: 'moderate',
        },
    },
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);