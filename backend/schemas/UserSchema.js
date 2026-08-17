const mongoose = require('mongoose');
const ENUMS = require('./enums/UserEnums');


const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, maxlength: 50 },
    lastName: { type: String, required: true, maxlength: 50 },
    designation: { type: String, required: true, maxlength: 100 },
    institution: { type: String, required: true, maxlength: 100 },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    userName: { type: String },
    password: { type: String, required: true, minLength: 6 },
    confirmPassword: { type: String, required: true, minLength: 6 },
    avatar: { type: String },
    activeState: { type: Boolean, required: true },
    isVerified: { type: Boolean, required: true },
    passwordResetToken: { type: String, default: null },
    passwordResetTokenExpires: { type: Date, default: null },
    role: { type: String, required: true, enum: ENUMS.ROLES },
    emailOtp: { type: String },
    mobileOtp: { type: Number },
    emailOtpExpiry: { type: Date },
    mobileOtpExpiry: { type: Date },
    isPhoneVerified: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    mustChangePassword: { type: Boolean, default: false },
    lastLoginTime: { type: Date },

    // Reviewer Specific Fields
    reviewerStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: null },
    isReviewer: { type: Boolean, default: false },
    agreedToGuidelines: { type: Boolean, default: false },
    videoCompleted: { type: Boolean, default: false },
    mcqScore: { type: Number, default: 0 },
    reviewerCvUrl: { type: String, default: null },
    areasOfExpertise: { type: [String], default: [] },

}, { timestamps: true });

// Performance indexes (email already has unique index)
UserSchema.index({ role: 1 });
UserSchema.index({ activeState: 1, role: 1 });

module.exports = mongoose.model('Users', UserSchema);
