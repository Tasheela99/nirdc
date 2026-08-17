const mongoose = require('mongoose');

const ReviewerRegistrationSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    stepsCompleted: {
        whoIsReviewer: { type: Boolean, default: false },
        qualifications: { type: Boolean, default: false },
        conditions: { type: Boolean, default: false },
        trainingVideo: { type: Boolean, default: false },
        mcq: { type: Boolean, default: false },
        nda: { type: Boolean, default: false }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Automatically delete the document after 24 hours (86400 seconds)
    }
});

const ReviewerRegistrationSession = mongoose.model('ReviewerRegistrationSession', ReviewerRegistrationSessionSchema);

module.exports = ReviewerRegistrationSession;
