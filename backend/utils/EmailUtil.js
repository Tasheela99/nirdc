const nodemailer = require('nodemailer');
const appName = process.env.APPLICATION_NAME;
const frontendURL = process.env.FRONTEND_URL;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_FROM_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const sendOTPEmail = async (user, otp) => {
    if (!user?.email || !otp) {
        throw new Error('Invalid user email or OTP is missing.');
    }

    const mailOptions = {
        from: {
            name: "NIRDC",
            address: process.env.GMAIL_FROM_EMAIL
        },
        to: user.email,
        subject: 'Account Verification OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Account Verification</h1>
                <p>Hello ${user.firstName} ${user.lastName},</p>
                <p>Use the OTP below to verify your account:</p>
                <div style="text-align: center; background-color: #f5f5f5; padding: 20px; 
                            font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                    ${otp}
                </div>
                <p>This OTP expires in 10 minutes. If you didn’t request this, ignore this email.</p>
                <p>Regards,<br>${appName}</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendVerificationEmail = async (user, verificationToken) => {
    const verificationURL = `${frontendURL}/verify-email/${encodeURIComponent(verificationToken)}`;

    const mailOptions = {
        from: {
            name: "NIRDC",
            address: process.env.GMAIL_FROM_EMAIL
        },
        to: user.email,
        subject: 'Email Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Email Verification</h1>
                <p>Hello ${user.firstName} ${user.lastName},</p>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationURL}" style="display: inline-block; 
                    background-color: #4CAF50; color: #ffffff; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
                <p>This link expires in 1 hour.</p>
                <p>Regards,<br>${appName}</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (user, resetToken) => {
    const resetURL = `${frontendURL}/reset-password/${encodeURIComponent(resetToken)}`;

    const mailOptions = {
        from: {
            name: "NIRDC",
            address: process.env.GMAIL_FROM_EMAIL
        },
        to: user.email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Password Reset Request</h1>
                <p>Hello ${user.fullName},</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetURL}" style="display: inline-block; 
                    background-color: #4CAF50; color: #ffffff; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
                <p>This link expires in 1 hour. If you didn’t request this, please ignore it.</p>
                <p>Regards,<br>${appName}</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendPasswordResetConfirmationEmail = async (user) => {
    const mailOptions = {
        from: {
            name: "NIRDC",
            address: process.env.GMAIL_FROM_EMAIL
        },
        to: user.email,
        subject: 'Password Reset Successful',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Password Reset Successful</h1>
                <p>Hello ${user.fullName},</p>
                <p>Your password has been successfully reset.</p>
                <p>If you didn’t perform this action, please contact our support team immediately.</p>
                <p>Regards,<br>${appName}</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};


const sendDirectorWelcomeEmail = async (user, tempPassword) => {
    const loginURL = `${frontendURL}/login`;

    const mailOptions = {
        from: {
            name: "NIRDC",
            address: process.env.GMAIL_FROM_EMAIL
        },
        to: user.email,
        subject: 'Welcome to NIRDC - Your Director Account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #001d4a 0%, #003893 100%); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to NIRDC</h1>
                    <p style="color: #ccc; margin: 8px 0 0;">National Initiative for R&D Commercialisation</p>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Hello <strong>${user.firstName} ${user.lastName}</strong>,</p>
                    <p>Your Director account has been created. Please use the credentials below to log in:</p>
                    <div style="background-color: #f8f9fa; border-left: 4px solid #003893; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                        <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background: #e9ecef; padding: 2px 8px; border-radius: 4px; font-size: 14px;">${tempPassword}</code></p>
                    </div>
                    <p style="color: #dc3545; font-weight: 500;">⚠ You will be required to change your password upon first login.</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${loginURL}" style="display: inline-block; background: linear-gradient(135deg, #003893, #2E86C1); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                            Login to NIRDC
                        </a>
                    </div>
                    <p style="color: #6c757d; font-size: 13px;">If you did not expect this email, please contact the NIRDC administration.</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendReviewerApprovalEmail = async (user) => {
    const loginURL = `${frontendURL}/login`;

    const mailOptions = {
        from: {
            name: "NIRDC",
            address: process.env.GMAIL_FROM_EMAIL
        },
        to: user.email,
        subject: 'Reviewer Application Approved - NIRDC',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #001d4a 0%, #003893 100%); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Application Approved</h1>
                    <p style="color: #ccc; margin: 8px 0 0;">National Initiative for R&D Commercialisation</p>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Hello <strong>${user.firstName} ${user.lastName}</strong>,</p>
                    <p style="color: #333; line-height: 1.6;">Congratulations! Your application to become a reviewer has been <strong>approved</strong> by the NIRDC administration.</p>
                    <p style="color: #333; line-height: 1.6;">You can now log in to your account and access the Reviewer Dashboard to view proposals assigned to you.</p>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${loginURL}" style="display: inline-block; background: linear-gradient(135deg, #003893, #2E86C1); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                            Login to NIRDC
                        </a>
                    </div>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendReviewerRejectionEmail = async (user) => {
    const mailOptions = {
        from: {
            name: "NIRDC",
            address: process.env.GMAIL_FROM_EMAIL
        },
        to: user.email,
        subject: 'Reviewer Application Status Update - NIRDC',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #001d4a 0%, #003893 100%); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Application Status</h1>
                    <p style="color: #ccc; margin: 8px 0 0;">National Initiative for R&D Commercialisation</p>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Hello <strong>${user.firstName} ${user.lastName}</strong>,</p>
                    <p style="color: #333; line-height: 1.6;">Thank you for your interest in becoming a reviewer for NIRDC. After careful consideration, we regret to inform you that your application has been <strong>rejected</strong> at this time.</p>
                    <p style="color: #333; line-height: 1.6;">We appreciate the time you took to apply and complete the assessment.</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendMail = async (user, subject, message) => {
    const mailOptions = {
        from: {
            name: "NIRDC",
            address: process.env.GMAIL_FROM_EMAIL
        },
        to: user.email,
        subject: `${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Confirmation</h1>
                <h3>Dear Applicant,</h3>
                <p>${message}</p>
                <p>Regards,<br>${appName}</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendProposalStatusEmail = async (user, applicationId, proposalType, status) => {
    const statusConfig = {
        'PENDING': { label: 'Pending', color: '#d97706', bg: '#fef3c7', message: 'Your proposal is currently pending review.' },
        'UNDER_REVIEW': { label: 'Under Review', color: '#3b82f6', bg: '#dbeafe', message: 'Your proposal is now being actively reviewed by our team.' },
        'APPROVED': { label: 'Approved', color: '#10b981', bg: '#d1fae5', message: 'Congratulations! Your proposal has been approved.' },
        'REJECTED': { label: 'Rejected', color: '#ef4444', bg: '#fee2e2', message: 'Unfortunately, your proposal has not been approved at this time.' },
    };

    const config = statusConfig[status] || statusConfig['PENDING'];
    const userName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email;

    const mailOptions = {
        from: {
            name: "NIRDC",
            address: process.env.GMAIL_FROM_EMAIL
        },
        to: user.email,
        subject: `${proposalType} Status Update - ${config.label}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #001d4a 0%, #003893 100%); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Proposal Status Update</h1>
                    <p style="color: #93c5fd; margin: 8px 0 0; font-size: 14px;">National Initiative for R&D Commercialisation</p>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hello <strong>${userName}</strong>,</p>
                    <p style="color: #555; line-height: 1.6;">The status of your <strong>${proposalType}</strong> has been updated.</p>
                    
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                        <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Application ID</p>
                        <p style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #003893;">${applicationId}</p>
                        <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Current Status</p>
                        <span style="display: inline-block; background-color: ${config.bg}; color: ${config.color}; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 14px; border: 1px solid ${config.color}30;">
                            ${config.label}
                        </span>
                    </div>

                    <p style="color: #555; line-height: 1.6; background: ${config.bg}; padding: 12px 16px; border-radius: 6px; border-left: 4px solid ${config.color};">
                        ${config.message}
                    </p>

                    <p style="color: #888; font-size: 13px; margin-top: 24px;">If you have any questions, please contact the NIRDC administration.</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendProposalSubmissionDetailsEmail = async (user, proposalType, applicationData) => {
    const adminEmail = process.env.ADMIN_USER_EMAIL;
    const userName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email;

    // Helper to format keys
    const formatKey = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    // Fields to exclude from email (like attachments, internal IDs)
    const excludeFields = [
        '_id', 'userId', '__v', 'certificationsDocuments', 'extraCertificationsDocuments', 
        'documents', 'supportingDocuments', 'certifications', 'applicationStatus', 'isOpenedByAdmin', 'comments',
        'createdAt', 'updatedAt', 'password', 'role'
    ];

    let commonHtmlContent = `
                <p style="font-size: 16px; color: #333; margin-top: 20px;"><strong>Application ID:</strong> <span style="color: #003893; font-weight: bold;">${applicationData.applicationId || "N/A"}</span></p>
                
                <h2 style="color: #003893; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px; margin-top: 30px; font-size: 18px;">Proposal Details</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
    `;

    const renderValue = (value) => {
        if (value === null || value === undefined || value === "") return "N/A";
        if (Array.isArray(value)) {
            if (value.length === 0) return "N/A";
            // Check if array of strings (might be urls, but we don't know for sure, if it is urls we excluded attachment fields but just in case)
            return `<ul style="margin: 0; padding-left: 20px;">${value.map(v => `<li>${renderValue(v)}</li>`).join('')}</ul>`;
        }
        if (typeof value === 'object') {
            let objHtml = '<table style="width: 100%; border-collapse: collapse;">';
            for (const [k, v] of Object.entries(value)) {
                // Don't render empty objects completely if they are empty
                if (k === "_id") continue;
                objHtml += `<tr><td style="padding: 5px 0; font-weight: bold; width: 40%; color: #555; font-size: 14px;">${formatKey(k)}:</td><td style="padding: 5px 0; font-size: 14px;">${renderValue(v)}</td></tr>`;
            }
            objHtml += '</table>';
            return objHtml;
        }
        return String(value);
    };

    // Sort keys slightly for better reading? Or just rely on object insertion order (usually sufficient)
    for (const [key, value] of Object.entries(applicationData)) {
        if (excludeFields.includes(key)) continue;
        
        commonHtmlContent += `
            <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 10px; font-weight: bold; width: 35%; color: #333; vertical-align: top; background-color: #f8f9fa; font-size: 14px;">${formatKey(key)}</td>
                <td style="padding: 12px 10px; color: #555; vertical-align: top; font-size: 14px; word-break: break-word;">${renderValue(value)}</td>
            </tr>
        `;
    }

    const userIntro = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #001d4a 0%, #003893 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px;">${proposalType} Submitted Successfully</h1>
                <p style="color: #93c5fd; margin: 8px 0 0; font-size: 14px;">National Initiative for R&D Commercialisation</p>
            </div>
            <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">Hello <strong>${userName}</strong>,</p>
                <p style="font-size: 15px; color: #555; line-height: 1.6;">Thank you for your submission. Your proposal details have been recorded successfully. Here is a copy of the information you provided:</p>
    `;

    const adminIntro = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #001d4a 0%, #003893 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px;">New ${proposalType} Submitted</h1>
                <p style="color: #93c5fd; margin: 8px 0 0; font-size: 14px;">National Initiative for R&D Commercialisation</p>
            </div>
            <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">Hello <strong>Admin</strong>,</p>
                <p style="font-size: 15px; color: #555; line-height: 1.6;">A new ${proposalType} has been submitted by <strong>${userName}</strong>.</p>
                
                <h3 style="color: #003893; margin-top: 20px; font-size: 16px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">Applicant Details</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
                    <tr><td style="padding: 5px 0; font-weight: bold; width: 35%; color: #333;">Name:</td><td style="padding: 5px 0; color: #555;">${userName}</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: bold; color: #333;">Email:</td><td style="padding: 5px 0; color: #555;">${user.email || 'N/A'}</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: bold; color: #333;">Mobile:</td><td style="padding: 5px 0; color: #555;">${user.mobile || 'N/A'}</td></tr>
                    ${user.designation ? `<tr><td style="padding: 5px 0; font-weight: bold; color: #333;">Designation:</td><td style="padding: 5px 0; color: #555;">${user.designation}</td></tr>` : ''}
                    ${user.institution ? `<tr><td style="padding: 5px 0; font-weight: bold; color: #333;">Institution:</td><td style="padding: 5px 0; color: #555;">${user.institution}</td></tr>` : ''}
                </table>

                <p style="font-size: 15px; color: #555; line-height: 1.6; margin-top: 20px;">Here is a copy of the information provided in the proposal:</p>
    `;

    const footer = `
                </table>
                <p style="color: #888; font-size: 13px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 15px;">
                    This is an automated email. Please do not reply directly to this message.
                </p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
            </div>
        </div>
    `;

    // Mail options for User
    const userMailOptions = {
        from: { name: "NIRDC", address: process.env.GMAIL_FROM_EMAIL },
        to: user.email,
        subject: `${proposalType} Submitted Successfully - ${applicationData.applicationId}`,
        html: userIntro + commonHtmlContent + footer
    };

    // Mail options for Admin
    const adminMailOptions = {
        from: { name: "NIRDC", address: process.env.GMAIL_FROM_EMAIL },
        to: adminEmail,
        subject: `New ${proposalType} Submission - ${applicationData.applicationId}`,
        html: adminIntro + commonHtmlContent + footer
    };

    try {
        await transporter.sendMail(userMailOptions);
        if (adminEmail) {
            await transporter.sendMail(adminMailOptions);
        }
    } catch (error) {
        console.error("Error sending proposal submission details email:", error);
    }
};

module.exports = {
    sendOTPEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendPasswordResetConfirmationEmail,
    sendDirectorWelcomeEmail,
    sendProposalStatusEmail,
    sendMail,
    sendProposalSubmissionDetailsEmail,
    sendReviewerApprovalEmail,
    sendReviewerRejectionEmail
};
