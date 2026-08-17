const ReviewerRegistrationSession = require('../schemas/ReviewerRegistrationSessionSchema');
const crypto = require('crypto');

// 1. Start a new registration session
exports.startSession = async (req, res) => {
    try {
        const sessionId = crypto.randomUUID();
        
        const newSession = new ReviewerRegistrationSession({
            sessionId,
            stepsCompleted: {
                whoIsReviewer: false,
                qualifications: false,
                conditions: false,
                trainingVideo: false,
                mcq: false,
                nda: false
            }
        });

        await newSession.save();

        return res.status(201).json({
            success: true,
            sessionId: newSession.sessionId,
            stepsCompleted: newSession.stepsCompleted
        });
    } catch (error) {
        console.error("Error starting reviewer registration session:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 2. Get the current state of a session
exports.getSessionState = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Session ID is required" });
        }

        const session = await ReviewerRegistrationSession.findOne({ sessionId });
        
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found or expired" });
        }

        return res.status(200).json({
            success: true,
            stepsCompleted: session.stepsCompleted
        });
    } catch (error) {
        console.error("Error fetching session state:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 3. Mark a step as completed
exports.completeStep = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { step } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Session ID is required" });
        }

        const validSteps = ['whoIsReviewer', 'qualifications', 'conditions', 'trainingVideo', 'mcq', 'nda'];
        if (!validSteps.includes(step)) {
            return res.status(400).json({ success: false, message: "Invalid step name" });
        }

        const session = await ReviewerRegistrationSession.findOne({ sessionId });
        
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found or expired" });
        }

        session.stepsCompleted[step] = true;
        await session.save();

        return res.status(200).json({
            success: true,
            message: `Step ${step} marked as completed`,
            stepsCompleted: session.stepsCompleted
        });
    } catch (error) {
        console.error("Error completing step:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
