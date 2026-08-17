const mongoose = require('mongoose');

const ReviewAssignmentSchema = new mongoose.Schema({
    proposalId: { 
        type: String, 
        required: true 
    },
    proposalType: { 
        type: String, 
        required: true,
        enum: ['investment', 'research-investment', 'research-proposal']
    },
    reviewerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['PENDING', 'COMPLETED'], 
        default: 'PENDING' 
    },
    marks: { 
        type: Number, 
        default: null,
        min: 0,
        max: 100
    },
    comment: { 
        type: String, 
        default: null 
    },
    assignedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true 
    },
    completedAt: { 
        type: Date, 
        default: null 
    }
}, { timestamps: true });

// Prevent a reviewer from being assigned the same proposal twice
ReviewAssignmentSchema.index({ proposalId: 1, reviewerId: 1 }, { unique: true });

// Index for fetching proposals by reviewer
ReviewAssignmentSchema.index({ reviewerId: 1, status: 1 });

module.exports = mongoose.model('ReviewAssignment', ReviewAssignmentSchema);
