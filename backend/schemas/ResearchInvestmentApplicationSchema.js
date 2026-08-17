const mongoose = require("mongoose");

const ResearchInvestmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    department: { type: String },
    projectTitle: { type: String, required: true },
    investmentObjectives: { type: String, maxLength: 5000, required: true },
    marketDemand: { type: String, maxLength: 5000, required: true },
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
    researchGaps: { type: String, required: false },
    researchObjectives: { type: String, required: false },
    researchPlan: { type: String, required: false },
    currencyValue: { type: String, required: false },
    projectCost: { type: String, required: false, default: "" },
    expenditure: { type: String, required: false, default: "" },
    budget: { type: String, required: false, default: "" },
    researchPlace: { type: String, required: false },
    significance: {
        other: { type: String },
        socialImpact: { type: String },
        environmentalImpact: { type: String },
        economicImpact: { type: String },
    },
    intellectualProperty: {
        patentNumber: { type: String, required: false },
        receivedDate: { type: String, required: false },
        localOrInternational: { type: String, required: false },
        status: { type: String, required: true },
    },
    trl: { type: String, required: true },
    publications: { type: String, required: true },
    totalInvestment: { type: String, required: true },
    roi: { type: String, required: true },
    resourcesCollaborations: { type: String, required: true },
    riskAssumptions: { type: String, required: true },
    certificationsDocuments: [{ type: String }],
    extraCertificationsDocuments: [{ type: String }],
    applicationId: { type: String, required: true },
    applicationStatus: {
        type: String,
        enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    }
    ,
    isOpenedByAdmin: { type: Boolean, default: false },
    comments: [{
        text: { type: String, required: true },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        authorName: { type: String },
        role: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Performance indexes
ResearchInvestmentSchema.index({ userId: 1, applicationStatus: 1 });
ResearchInvestmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ResearchInvestment", ResearchInvestmentSchema);
