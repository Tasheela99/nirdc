const validator = require('validator');
const UserSchema = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');
const { generateAlphanumericOtp } = require('../utils/OtpGeneraterUtil');
const { sendOTPEmail, sendReviewerApprovalEmail, sendReviewerRejectionEmail } = require('../utils/EmailUtil');
const USER_ENUMS = require('../schemas/enums/UserEnums');
const { handleFileUploads } = require('../utils/FileUploadAwsUtil');
const ReviewerRegistrationSession = require('../schemas/ReviewerRegistrationSessionSchema');

const registerReviewer = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            designation,
            institution,
            mobile,
            email,
            country,
            password,
            confirmPassword,
            agreedToGuidelines,
            videoCompleted,
            mcqScore,
            areasOfExpertise,
            sessionId
        } = req.body;

        const validationErrors = [];

        if (!firstName?.trim()) validationErrors.push('First name is required');
        if (!lastName?.trim()) validationErrors.push('Last name is required');
        if (!email?.trim()) validationErrors.push('Email is required');
        if (email && !validator.isEmail(email)) validationErrors.push('Invalid email format');

        if (!password) {
            validationErrors.push('Password is required');
        } else if (password !== confirmPassword) {
            validationErrors.push('Passwords do not match');
        }

        if (!sessionId) {
            validationErrors.push('Registration session ID is required');
        }

        if (parseInt(mcqScore) < 8) validationErrors.push('MCQ Score must be at least 8');

        // Parse areasOfExpertise if it comes as a stringified array (from FormData)
        let parsedExpertise = areasOfExpertise;
        if (typeof areasOfExpertise === 'string') {
            try { parsedExpertise = JSON.parse(areasOfExpertise); } catch (e) { parsedExpertise = []; }
        }
        if (!parsedExpertise || !Array.isArray(parsedExpertise) || parsedExpertise.length === 0) {
            validationErrors.push('At least one area of expertise is required');
        }

        if (!req.files || !req.files.cv) {
            validationErrors.push('CV upload is required');
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({ status: false, errors: validationErrors });
        }

        // Verify session state
        const session = await ReviewerRegistrationSession.findOne({ sessionId });
        if (!session) {
            return res.status(400).json({ status: false, message: "Invalid or expired registration session. Please refresh and try again." });
        }

        const { stepsCompleted } = session;
        if (!stepsCompleted.whoIsReviewer || !stepsCompleted.qualifications || !stepsCompleted.conditions || !stepsCompleted.trainingVideo || !stepsCompleted.mcq || !stepsCompleted.nda) {
            return res.status(400).json({ status: false, message: "You must complete all steps before submitting your registration." });
        }

        const existingUserByEmail = await UserSchema.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ status: false, message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const emailOtp = generateAlphanumericOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = new UserSchema({
            firstName,
            lastName,
            designation,
            institution,
            mobile,
            email,
            country,
            userName: `${firstName} ${lastName}`,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            activeState: false,
            isVerified: false,
            role: USER_ENUMS.ROLES.REVIEWER, // Directly assign REVIEWER role
            emailOtp,
            emailOtpExpiry: otpExpiry,
            reviewerStatus: 'PENDING',
            agreedToGuidelines: true,
            videoCompleted: true,
            mcqScore: parseInt(mcqScore),
            areasOfExpertise: parsedExpertise,
        });

        const savedUser = await newUser.save();

        // Upload CV
        try {
            const uploadedCvUrls = await handleFileUploads(req.files.cv, 'reviewerCv', savedUser._id, 'cv');
            if (uploadedCvUrls && uploadedCvUrls.length > 0) {
                savedUser.reviewerCvUrl = uploadedCvUrls[0];
                await savedUser.save();
            }
        } catch (uploadError) {
            console.error('Failed to upload CV:', uploadError);
            await UserSchema.findByIdAndDelete(savedUser._id);
            return res.status(500).json({ status: false, message: 'Failed to upload CV' });
        }

        // Delete the session since registration is complete
        await ReviewerRegistrationSession.deleteOne({ sessionId });

        try {
            await sendOTPEmail(savedUser, emailOtp);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            // We still return 201 because the user was created, but we warn them.
            return res.status(201).json({
                status: true,
                message: 'Reviewer application submitted successfully, but we could not send the OTP email. Please contact the administrator.'
            });
        }

        return res.status(201).json({
            status: true,
            message: 'Reviewer application submitted successfully. Please verify your account with the OTP sent to your email.'
        });

    } catch (error) {
        console.error('Error in registerReviewer:', error);
        return res.status(500).json({ status: false, message: 'Server error, please try again later.' });
    }
};

const getPendingReviewers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await UserSchema.countDocuments({ reviewerStatus: 'PENDING' });
        const pendingReviewers = await UserSchema.find({ reviewerStatus: 'PENDING' })
            .select('-password -confirmPassword')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({ 
            status: true, 
            data: pendingReviewers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error in getPendingReviewers:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const getAllReviewers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const statusFilter = req.query.status;

        let query = {};
        if (statusFilter === 'PENDING') {
            query = { reviewerStatus: 'PENDING' };
        } else if (statusFilter === 'APPROVED') {
            query = { reviewerStatus: 'APPROVED', role: USER_ENUMS.ROLES.REVIEWER };
        } else {
            query = {
                $or: [
                    { reviewerStatus: 'PENDING' },
                    { reviewerStatus: 'APPROVED', role: USER_ENUMS.ROLES.REVIEWER }
                ]
            };
        }

        const total = await UserSchema.countDocuments(query);
        const reviewers = await UserSchema.find(query)
            .select('-password -confirmPassword')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({ 
            status: true, 
            data: reviewers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error in getAllReviewers:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const getApprovedReviewers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { 
            role: USER_ENUMS.ROLES.REVIEWER,
            reviewerStatus: 'APPROVED' 
        };

        const total = await UserSchema.countDocuments(query);
        const approvedReviewers = await UserSchema.find(query)
            .select('-password -confirmPassword')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({ 
            status: true, 
            data: approvedReviewers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error in getApprovedReviewers:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const approveReviewer = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserSchema.findById(id);

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        if (!user.agreedToGuidelines || !user.videoCompleted || user.mcqScore < 8 || !user.reviewerCvUrl) {
            return res.status(400).json({ status: false, message: 'User has not completed all requirements' });
        }

        user.reviewerStatus = 'APPROVED';
        user.isReviewer = true;
        user.role = USER_ENUMS.ROLES.REVIEWER;
        
        await user.save();

        // Send approval email
        try {
            await sendReviewerApprovalEmail(user);
        } catch (emailError) {
            console.error('Failed to send reviewer approval email:', emailError);
        }

        return res.status(200).json({ status: true, message: 'Reviewer approved successfully' });
    } catch (error) {
        console.error('Error in approveReviewer:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const rejectReviewer = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserSchema.findById(id);

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        user.reviewerStatus = 'REJECTED';
        await user.save();

        // Send rejection email
        try {
            await sendReviewerRejectionEmail(user);
        } catch (emailError) {
            console.error('Failed to send reviewer rejection email:', emailError);
        }

        return res.status(200).json({ status: true, message: 'Reviewer rejected successfully' });
    } catch (error) {
        console.error('Error in rejectReviewer:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    registerReviewer,
    getPendingReviewers,
    getApprovedReviewers,
    getAllReviewers,
    approveReviewer,
    rejectReviewer
};
