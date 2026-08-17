const mongoose = require('mongoose');

const InvestorApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    department: { type: String, trim: true },
    investmentObjectives: { type: String, maxLength: 5000, required: true },
    marketDemand: { type: String, maxLength: 5000, required: true },
    significance: {
        exportPotential: { type: Boolean, default: false },
        importSubstitution: { type: Boolean, default: false },
        other: { type: String },
        socialImpact: { type: String },
        environmentalImpact: { type: String },
        economicImpact: { type: String },
    },
    totalProjectInvestment: { type: String, required: true },
    expectedROI: { type: String, required: true },
    existingResources: {
        local: { type: Boolean, required: false },
        international: { type: Boolean, required: false },
    },
    requiredAssistanceFromGovernment: {
        funds: { type: Boolean, default: false },
        regulatory: { type: Boolean, default: false },
        land: { type: Boolean, default: false },
        infrastructure: { type: Boolean, default: false },
        technicalAssistance: { type: Boolean, default: false },
        partnerships: { type: Boolean, default: false },
        ip: { type: Boolean, default: false },
        other: { type: String, default: "" }
    },
    riskAndAssumptions: { type: String, maxLength: 5000, required: true },
    documents: { type: [String], required: true },
    applicationId: { type: String, required: true },
    applicationStatus: {
        type: String,
        enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    }
}, { timestamps: true });

// Track if admin has opened the application
InvestorApplicationSchema.add({
    isOpenedByAdmin: { type: Boolean, default: false },
    comments: [{
        text: { type: String, required: true },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        authorName: { type: String },
        role: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]
});

// Performance indexes
InvestorApplicationSchema.index({ userId: 1, applicationStatus: 1 });
InvestorApplicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('InvestorApplication', InvestorApplicationSchema);
