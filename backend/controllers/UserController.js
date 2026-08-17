const validator = require('validator');
const UserSchema = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendPasswordResetConfirmationEmail, sendOTPEmail, sendDirectorWelcomeEmail } = require('../utils/EmailUtil');
const { generateAlphanumericOtp } = require('../utils/OtpGeneraterUtil');
const USER_ENUMS = require('../schemas/enums/UserEnums');
const InvestorApplicationSchema = require("../schemas/InvestorApplicationSchema");
const ResearchInvestmentApplicationSchema = require("../schemas/ResearchInvestmentApplicationSchema");
const ResearchProposalApplicationSchema = require("../schemas/ResearchProposalApplicationSchema");
const NewsSchema = require("../schemas/NewsSchema");
const { deleteFileFromAws, extractFileNameFromUrl } = require('../utils/FileUploadAwsUtil');
const mongoose = require('mongoose');
const { startSession } = require('mongoose');

const initializeAdmin = async () => {
    try {
        const adminFirstName = process.env.ADMIN_USER_FIRST_NAME;
        const adminLastName = process.env.ADMIN_USER_LAST_NAME;
        const adminEmail = process.env.ADMIN_USER_EMAIL;
        const adminPassword = process.env.ADMIN_USER_PASSWORD;
        const adminMobile = process.env.ADMIN_USER_MOBILE;

        const existingAdmin = await UserSchema.findOne({ email: adminEmail });
        if (existingAdmin) {
            return;
        }
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const adminUser = new UserSchema({
            firstName: adminFirstName,
            lastName: adminLastName,
            designation: "Super Admin",
            institution: "Research And Development",
            mobile: adminMobile,
            email: adminEmail,
            country: "Sri Lanka",
            userName: adminFirstName + " " + adminLastName,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            avatar: "",
            activeState: true,
            isVerified: true,
            passwordResetToken: null,
            passwordResetTokenExpires: null,
            role: USER_ENUMS.ROLES.SUPER_ADMIN,
            otp: null,
            otpExpiry: null,
            isPhoneVerified: true,
            isEmailVerified: true
        });
        await adminUser.save();
    } catch (error) {
        throw error;
    }
}

const signIn = async (req, res) => {
    try {
        const selectedUser = await UserSchema.findOne({ email: req.body.email });
        if (!selectedUser) {
            return res.status(404).json({ label: "USER_NOT_FOUND", status: false, message: 'User not found. Please register first.' });
        }

        if (!selectedUser.isVerified) {
            return res.status(401).json({
                label: "NOT_VERIFIED",
                status: false,
                message: 'Please verify your email address before signing in.'
            });
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, selectedUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ label: "INCORRECT_PASSWORD", status: false, message: "Incorrect password. Please try again." });
        }

        if (selectedUser.role === USER_ENUMS.ROLES.REVIEWER) {
            if (selectedUser.reviewerStatus !== 'APPROVED') {
                return res.status(403).json({
                    label: "REVIEWER_PENDING",
                    status: false,
                    message: "Your reviewer account is pending admin approval."
                });
            }
        }

        selectedUser.lastLoginTime = new Date().toISOString();
        await selectedUser.save();

        const email = selectedUser.email;
        const role = selectedUser.role;
        const id = selectedUser._id;
        const userName = selectedUser.userName;

        const mustChangePassword = selectedUser.mustChangePassword || false;
        const token = jwt.sign({ email, role, id, userName }, process.env.SECRET_KEY, { expiresIn: 3600 });
        res.setHeader('Authorization', `Bearer ${token}`);

        return res.status(200).json({ status: true, message: "Login successful.", token, mustChangePassword });

    } catch (error) {
        return res.status(500).json({ status: false, label: 'SERVER_ERROR', message: 'Something went wrong. Please try again later.' });
    }
}

const signUp = async (req, res) => {
    const validationErrors = [];

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
            confirmPassword
        } = req.body;

        // Validation checks with detailed error collection
        if (!firstName?.trim()) validationErrors.push('First name is required');
        if (!lastName?.trim()) validationErrors.push('Last name is required');
        if (!designation?.trim()) validationErrors.push('Designation is required');
        if (!institution?.trim()) validationErrors.push('Institution is required');
        if (!email?.trim()) validationErrors.push('Email is required');
        if (!country?.trim()) validationErrors.push('Country is required');

        // Email validation
        if (email && !validator.isEmail(email)) {
            validationErrors.push('Invalid email format');
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#%^()/])[A-Za-z\d@$!%*?&.#%^()/]{8,}$/;
        if (!password) {
            validationErrors.push('Password is required');
        } else {
            if (!passwordRegex.test(password)) {
                validationErrors.push('Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character');
            }
            if (password !== confirmPassword) {
                validationErrors.push('Passwords do not match');
            }
        }

        // If any validation errors, return them
        if (validationErrors.length > 0) {
            return res.status(400).json({
                status: false,
                errors: validationErrors
            });
        }

        // Check for existing user
        const existingUserByEmail = await UserSchema.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({
                label: "USER_EMAIL_EXISTS",
                status: false,
                message: "User with this email already exists"
            });
        }

        const existingUserByPhone = await UserSchema.findOne({ mobile });
        if (existingUserByPhone) {
            return res.status(400).json({
                label: "USER_PHONE_EXISTS",
                status: false,
                message: "User with this phone number already exists",
            });
        }

        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);


        // OTP generation (email only)
        const emailOtp = generateAlphanumericOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Create new user (no phone verification fields)
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
            avatar: "",
            activeState: false,
            isVerified: false,
            passwordResetToken: null,
            passwordResetTokenExpires: null,
            role: USER_ENUMS.ROLES.USER,
            emailOtp,
            emailOtpExpiry: otpExpiry,
            isEmailVerified: false
        });

        await newUser.save();

        // Send OTP (email only)
        await sendOTPEmail(newUser, emailOtp);

        return res.status(201).json({
            status: true,
            message: 'User created successfully. Please verify your account with the OTP sent to your email.'
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server error, please try again later.',
            errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const verifyEmailWithOtp = async (req, res) => {
    try {
        const { email, emailOtp } = req.body;
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        if (user.emailOtpExpiry < new Date()) {
            return res.status(400).json({ status: false, message: 'OTP has expired. Please request a new one.' });
        }

        // Compare OTPs as strings
        if (user.emailOtp.trim() !== emailOtp.trim()) {
            return res.status(400).json({ status: false, message: 'Invalid OTP' });
        }
        user.isEmailVerified = true;
        user.activeState = true;
        user.isVerified = true;

        // Reset OTP and expiry
        user.emailOtp = null;
        user.emailOtpExpiry = null;

        await user.save();

        return res.status(200).json({
            status: true,
            message: 'Email verified successfully',
        });
    } catch (error) {

        return res.status(500).json({ status: false, message: 'Server error, please try again later' });
    }
};

const resendOTP = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();

        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        const emailOtp = generateAlphanumericOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.emailOtp = emailOtp;
        user.emailOtpExpiry = otpExpiry;
        await user.save();

        await sendOTPEmail(user, emailOtp);

        return res.status(200).json({
            status: true,
            message: 'New OTP has been sent to your email.'
        });

    } catch (error) {

        return res.status(500).json({ status: false, message: 'Server error, please try again later' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: false,
                label: 'USER_NOT_FOUND',
                message: 'No account found with that email address.'
            });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.passwordResetToken = passwordResetToken;
        user.passwordResetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();

        await sendPasswordResetEmail(user, resetToken);

        return res.status(200).json({
            status: true,
            message: 'Password reset link has been sent to your email.'
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            label: 'SERVER_ERROR',
            message: 'Something went wrong. Please try again later.'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = await UserSchema.findOne({
            passwordResetToken,
            passwordResetTokenExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({
                status: false,
                label: 'INVALID_TOKEN',
                message: 'Reset link is invalid or has expired. Please request a new one.'
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.passwordResetTokenExpires = null;
        await user.save();

        await sendPasswordResetConfirmationEmail(user);

        return res.status(200).json({
            status: true,
            message: 'Password has been reset successfully.'
        });
    } catch (error) {

        return res.status(500).json({
            status: false,
            label: 'SERVER_ERROR',
            message: 'Something went wrong. Please try again later.'
        });
    }
};

const createDirector = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            designation,
            institution,
            mobile,
            email,
            country,
        } = req.body;

        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: false, message: "User with this email already exists." });
        }
        if (!mobile || !/^\+\d{1,3}\d{9,12}$/.test(mobile)) {
            return res.status(400).json({
                status: false,
                message: 'A valid mobile number with a country code is required (e.g., +94701234567).'
            });
        }

        // Auto-generate temporary password
        const tempPassword = crypto.randomBytes(6).toString('hex'); // 12 char hex string
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const tempDirectorUser = new UserSchema({
            firstName,
            lastName,
            designation,
            institution,
            mobile,
            email,
            country,
            userName: firstName + " " + lastName,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            avatar: "",
            activeState: true,
            isVerified: true,
            passwordResetToken: null,
            passwordResetTokenExpires: null,
            role: USER_ENUMS.ROLES.DIRECTOR,
            emailOtp: null,
            mobileOtp: null,
            emailOtpExpiry: null,
            mobileOtpExpiry: null,
            isPhoneVerified: true,
            isEmailVerified: true,
            mustChangePassword: true
        });

        await tempDirectorUser.save();

        // Send welcome email with temp password
        try {
            await sendDirectorWelcomeEmail(tempDirectorUser, tempPassword);
        } catch (emailErr) {
            console.error('Failed to send director welcome email:', emailErr);
            // Director still created, just email failed
        }

        return res.status(201).json({
            status: true,
            message: 'Director Created Successfully. A welcome email with login credentials has been sent.'
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Server error, please try again later.' });
    }
}

const getAllDirectors = async (req, res) => {
    try {
        const directors = await UserSchema.find({ role: USER_ENUMS.ROLES.DIRECTOR })
            .select('_id firstName lastName designation institution mobile email country userName avatar activeState role');

        // Returning 200 with an empty array if none found

        return res.status(200).json({
            status: true,
            message: 'DIRECTORS RETRIEVED SUCCESSFULLY.',
            data: directors,
        });
    } catch (error) {

        return res.status(500).json({
            status: false,
            message: 'SERVER ERROR.PLEASE TRY AGAIN LATER.',
        });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;
    try {
        const user = await UserSchema.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        if (updates.password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#%^()/])[A-Za-z\d@$!%*?&.#%^()/]{8,}$/;
            if (!passwordRegex.test(updates.password)) {
                return res.status(400).json({
                    status: false,
                    message: "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
                });
            }
            if (updates.password !== updates.confirmPassword) {
                return res.status(400).json({ status: false, message: "Passwords do not match." });
            }
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        if (updates.email && updates.email !== user.email) {
            const existingUser = await UserSchema.findOne({ email: updates.email });
            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    message: "User with this email already exists."
                });
            }
        }

        if (updates.mobile && !/^\+\d{1,3}\d{9,12}$/.test(updates.mobile)) {
            return res.status(400).json({ status: false, message: 'A valid mobile number with country code is required (e.g., +94701234567).' });
        }

        const result = await UserSchema.updateOne({ _id: userId }, { $set: updates });
        if (result.modifiedCount > 0) {
            return res.status(200).json({
                status: true,
                message: 'USER UPDATED SUCCESSFULLY',
            });
        } else {
            return res.status(200).json({ status: false, message: 'NO CHANGES MADE' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'SERVER ERROR', error: error.message });
    }
};

const updateUserRole = async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;
    const requestUserRole = req.user.role;

    // Fix: Only allow SUPER_ADMIN or ADMIN
    if (!(requestUserRole === 'SUPER_ADMIN' || requestUserRole === 'ADMIN')) {
        return res.status(403).json({ status: false, message: 'PERMISSION DENIED' });
    }

    const validRoles = ['USER', 'ADMIN', 'DIRECTOR'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ status: false, message: 'INVALID ROLE PROVIDED' });
    }

    try {
        const user = await UserSchema.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ status: false, message: 'USER NOT FOUND' });
        }
        const result = await UserSchema.updateOne({ _id: userId }, { $set: { role: role } });
        if (result.modifiedCount > 0) {
            return res.status(200).json({
                status: true,
                message: 'USER ROLE UPDATED SUCCESSFULLY',
            });
        } else {
            return res.status(200).json({ status: false, message: 'NO CHANGES MADE' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'SERVER ERROR', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserSchema.find({ role: USER_ENUMS.ROLES.USER })

            .select('_id firstName lastName mobile email userName avatar designation institution country role activeState isVerified isEmailVerified lastLoginTime createdAt');

        // Returning 200 with an empty array if none found

        return res.status(200).json({
            status: true,
            message: 'USERS RETRIEVED SUCCESSFULLY.',
            data: users,
        });
    } catch (error) {

        return res.status(500).json({
            status: false,
            message: 'SERVER ERROR.PLEASE TRY AGAIN LATER.',
        });
    }
};

const deleteUser = async (req, res) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const { userId, adminPassword } = req.body;
        const requestUserRole = req.user.role;

        if (requestUserRole !== 'SUPER_ADMIN' && requestUserRole !== 'ADMIN' && requestUserRole !== 'DIRECTOR') {
            await session.abortTransaction();
            await session.endSession();
            return res.status(403).json({
                status: false,
                message: 'PERMISSION DENIED'
            });
        }

        const adminUser = await UserSchema.findById(req.user.id);

        if (adminUser.role !== 'SUPER_ADMIN' && adminUser.role !== 'ADMIN' && adminUser.role !== 'DIRECTOR') {
            await session.abortTransaction();
            await session.endSession();
            return res.status(403).json({
                status: false,
                message: 'PERMISSION DENIED'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(adminPassword, adminUser.password);
        if (!isPasswordCorrect) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(401).json({
                status: false,
                message: 'INCORRECT ADMIN PASSWORD'
            });
        }

        const user = await UserSchema.findById(userId);
        if (!user) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(404).json({ status: false, message: 'USER NOT FOUND' });
        }

        if (user.role === 'SUPER_ADMIN') {
            await session.abortTransaction();
            await session.endSession();
            return res.status(403).json({
                status: false,
                message: 'CANNOT DELETE SUPER_ADMIN USERS'
            });
        }

        // Only allow ADMIN and SUPER_ADMIN to delete DIRECTOR
        if (user.role === 'DIRECTOR' && requestUserRole !== 'ADMIN' && requestUserRole !== 'SUPER_ADMIN') {
            await session.abortTransaction();
            await session.endSession();
            return res.status(403).json({
                status: false,
                message: 'ONLY ADMIN OR SUPER_ADMIN CAN DELETE DIRECTOR USERS'
            });
        }

        if (user.role === 'ADMIN' && requestUserRole !== 'SUPER_ADMIN') {
            await session.abortTransaction();
            await session.endSession();
            return res.status(403).json({
                status: false,
                message: 'ONLY SUPER_ADMIN CAN DELETE ADMIN USERS'
            });
        }

        // Different deletion logic based on user role
        if (user.role === 'USER') {
            // For USER role - delete proposals and S3 files


            const [investorProposals, researchInvestmentProposals, researchProposals] = await Promise.all([
                InvestorApplicationSchema.find({ userId: userId }),
                ResearchInvestmentApplicationSchema.find({ userId: userId }),
                ResearchProposalApplicationSchema.find({ userId: userId })
            ]);



            // Delete files from S3 for all proposal types
            const s3DeletionPromises = [];

            for (const proposal of investorProposals) {
                s3DeletionPromises.push(deleteProposalFilesFromS3(proposal, 'InvestorApplication'));
            }

            for (const proposal of researchInvestmentProposals) {
                s3DeletionPromises.push(deleteProposalFilesFromS3(proposal, 'ResearchInvestmentApplication'));
            }

            for (const proposal of researchProposals) {
                s3DeletionPromises.push(deleteProposalFilesFromS3(proposal, 'ResearchProposalApplication'));
            }

            await Promise.all(s3DeletionPromises);


            // Delete all proposals from database
            await Promise.all([
                InvestorApplicationSchema.deleteMany({ userId: userId }),
                ResearchInvestmentApplicationSchema.deleteMany({ userId: userId }),
                ResearchProposalApplicationSchema.deleteMany({ userId: userId })
            ]);

        } else if (user.role === 'DIRECTOR' || user.role === 'ADMIN') {
            // For DIRECTOR/ADMIN role - delete their created news content


            // Find news created by this user
            const userNews = await NewsSchema.find({ user: userId });


            // Delete news images from S3 (if any)
            for (const news of userNews) {
                if (news.image) {
                    try {
                        const fileName = extractFileNameFromUrl(news.image);
                        if (fileName) {
                            const deleteSuccess = await deleteFileFromAws(fileName);
                            if (deleteSuccess) {

                            }
                        }
                    } catch (error) {

                    }
                }
            }

            // Delete news from database
            await NewsSchema.deleteMany({ user: userId });

        }

        // Delete the user
        const deleteResult = await UserSchema.deleteOne({ _id: userId });

        if (deleteResult.deletedCount > 0) {
            await session.commitTransaction();
            await session.endSession();
            return res.status(200).json({
                status: true,
                message: `${user.role} USER DELETED SUCCESSFULLY`,
            });
        } else {
            await session.abortTransaction();
            await session.endSession();
            return res.status(200).json({ status: false, message: 'NO DELETION OCCURRED' });
        }
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        res.status(500).json({ status: false, message: 'SERVER ERROR', error: error.message });
    }
};

// Helper function to delete files from S3 bucket
const deleteProposalFilesFromS3 = async (proposal, proposalType) => {
    const filesToDelete = [];

    try {
        // Based on proposal type, extract file URLs
        if (proposalType === 'ResearchProposalApplication') {
            // Handle ResearchProposalApplication files
            if (proposal.supportingDocuments && Array.isArray(proposal.supportingDocuments)) {
                filesToDelete.push(...proposal.supportingDocuments.filter(url => url));
            }
            if (proposal.certifications && Array.isArray(proposal.certifications)) {
                filesToDelete.push(...proposal.certifications.filter(url => url));
            }
        } else if (proposalType === 'ResearchInvestmentApplication') {
            // Handle ResearchInvestmentApplication files
            if (proposal.certificationsDocuments && Array.isArray(proposal.certificationsDocuments)) {
                filesToDelete.push(...proposal.certificationsDocuments.filter(url => url));
            }
            if (proposal.extraCertificationsDocuments && Array.isArray(proposal.extraCertificationsDocuments)) {
                filesToDelete.push(...proposal.extraCertificationsDocuments.filter(url => url));
            }
        }
        // Note: InvestorApplication doesn't seem to have file uploads based on schema

        // Delete each file from S3
        for (const fileUrl of filesToDelete) {
            try {
                const fileName = extractFileNameFromUrl(fileUrl);
                if (fileName) {
                    await deleteFileFromAws(fileName);
                }
            } catch (error) {
                console.error(`Error deleting file ${fileUrl}:`, error);
            }
        }


    } catch (error) {

    }
};

const deleteUserProposal = async (req, res) => {
    try {
        const { userId } = req.params;
        const { proposalId, password } = req.body;
        const requestingUserId = req.user.id;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(proposalId)) {
            return res.status(400).json({
                status: false,
                message: 'INVALID PROPOSAL ID FORMAT'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: false,
                message: 'INVALID USER ID FORMAT'
            });
        }

        // Verify that the requesting user is the owner of the proposal
        if (requestingUserId !== userId) {
            return res.status(403).json({
                status: false,
                message: 'PERMISSION DENIED: You can only delete your own proposals'
            });
        }

        // Verify user password for security
        const user = await UserSchema.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'USER NOT FOUND'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: 'INVALID PASSWORD'
            });
        }

        // First, let's check if the proposal exists in any of the collections
        const [investorProposal, researchProposal, researchInvestmentProposal] = await Promise.all([
            InvestorApplicationSchema.findOne({ _id: proposalId, userId: userId }),
            ResearchProposalApplicationSchema.findOne({ _id: proposalId, userId: userId }),
            ResearchInvestmentApplicationSchema.findOne({ _id: proposalId, userId: userId })
        ]);

        if (!investorProposal && !researchProposal && !researchInvestmentProposal) {
            return res.status(404).json({
                status: false,
                message: 'PROPOSAL NOT FOUND OR NOT OWNED BY USER'
            });
        }

        // Delete files from S3 bucket before deleting from database
        if (investorProposal) {
            await deleteProposalFilesFromS3(investorProposal, 'InvestorApplication');
        } else if (researchProposal) {
            await deleteProposalFilesFromS3(researchProposal, 'ResearchProposalApplication');
        } else if (researchInvestmentProposal) {
            await deleteProposalFilesFromS3(researchInvestmentProposal, 'ResearchInvestmentApplication');
        }

        // Now delete the found proposal from database
        let deleteResult = null;
        let deletedFrom = '';

        if (investorProposal) {
            deleteResult = await InvestorApplicationSchema.deleteOne({ _id: proposalId, userId: userId });
            deletedFrom = 'InvestorApplication';
        } else if (researchProposal) {
            deleteResult = await ResearchProposalApplicationSchema.deleteOne({ _id: proposalId, userId: userId });
            deletedFrom = 'ResearchProposalApplication';
        } else if (researchInvestmentProposal) {
            deleteResult = await ResearchInvestmentApplicationSchema.deleteOne({ _id: proposalId, userId: userId });
            deletedFrom = 'ResearchInvestmentApplication';
        }



        if (!deleteResult || deleteResult.deletedCount === 0) {
            return res.status(500).json({
                status: false,
                message: 'FAILED TO DELETE PROPOSAL'
            });
        }



        return res.status(200).json({
            status: true,
            message: 'PROPOSAL DELETED SUCCESSFULLY',
            deletedFrom: deletedFrom
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: 'SERVER ERROR',
            error: error.message
        });
    }
};

async function getAllUserProposals(req, res) {
    try {
        const userId = req.params.userId;
        const [proposalsType1, proposalsType2, proposalsType3] = await Promise.all([
            InvestorApplicationSchema.find({ userId: userId })
                .populate({ path: 'userId', select: 'firstName lastName -_id' })
                .populate({ path: 'significance', select: '-_id' })
                .populate({ path: 'existingResources', select: '-_id' })
                .populate({ path: 'requiredAssistanceFromGovernment', select: '-_id' })
                .lean(),

            ResearchProposalApplicationSchema.find({ userId: userId })
                .populate({ path: 'userId', select: 'firstName lastName -_id' })
                .populate({ path: 'significance', select: '-_id' })
                .populate({ path: 'intellectualProperty', select: '-_id' })
                .lean(),

            ResearchInvestmentApplicationSchema.find({ userId: userId })
                .populate({ path: 'userId', select: 'firstName lastName -_id' })
                .populate({ path: 'significance', select: '-_id' })
                .populate({ path: 'intellectualProperty', select: '-_id' })
                .populate({ path: 'requiredAssistanceFromGovernment', select: '-_id' })
                .lean()
        ]);
        const allProposals = {
            investorApplications: proposalsType1,
            researchProposals: proposalsType2,
            researchInvestments: proposalsType3
        };

        return res.status(200).json({ status: true, data: allProposals });
    } catch (error) {

        return res.status(500).json({ message: 'Error fetching proposals', error: error.message });
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate input
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                status: false,
                message: 'All fields are required'
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                status: false,
                message: 'New passwords do not match'
            });
        }

        // Password strength validation
        if (newPassword.length < 8) {
            return res.status(400).json({
                status: false,
                message: 'New password must be at least 8 characters long'
            });
        }

        // Find user
        const user = await UserSchema.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found'
            });
        }

        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({
                status: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear mustChangePassword flag
        await UserSchema.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
            confirmPassword: hashedNewPassword,
            mustChangePassword: false
        });



        return res.status(200).json({
            status: true,
            message: 'Password changed successfully'
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            label: 'SERVER_ERROR',
            message: 'Something went wrong. Please try again later.'
        });
    }
};

module.exports = {
    initializeAdmin,
    signUp,
    signIn,
    forgotPassword,
    resetPassword,
    verifyEmailWithOtp,
    resendOTP,
    createDirector,
    getAllDirectors,
    updateUser,
    updateUserRole,
    getAllUsers,
    deleteUser,
    deleteUserProposal,
    getAllUserProposals,
    changePassword,
};
