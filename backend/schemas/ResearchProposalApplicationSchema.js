const mongoose = require('mongoose');

const ResearchProposalApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    department: { type: String, trim: true, default: "" }, // Added default value
    title: { type: String, trim: true, default: "" }, // Added default value
    researchGaps: { type: String, maxLength: 5000, default: "" }, // Added default value
    objectives: { type: String, maxLength: 5000, default: "" }, // Added default value
    significance: {
        // exportPotential: {type: Boolean, default: false},
        // importSubstitution: {type: Boolean, default: false},
        other: { type: String },
        socialImpact: { type: String },
        environmentalImpact: { type: String },
        economicImpact: { type: String },
    },
    marketDemand: { type: String, maxLength: 5000, default: "" }, // Added default value
    innovation: { type: String, maxLength: 5000, default: "" }, // Added default value
    intellectualProperty: {
        patentNumber: { type: String, required: false },
        receivedDate: { type: String, required: false },
        localOrInternational: { type: String, required: false },
        status: { type: String, required: true },
    },
    technologyReadinessLevel: { type: String, default: "" }, // Added default value
    publications: { type: String, maxLength: 5000, default: "" }, // Added default value
    researchPlan: { type: String, maxLength: 5000, default: "" }, // Added default value
    // researchLocation: {type: String, default: ""}, // Added default value
    existingResources: { type: String, default: "" }, // Added default value
    supportingDocuments: [{ type: String, default: null }], // Added default value
    certifications: [{ type: String, default: null }], // Added default value
    currency: { type: String, default: "" }, // Added default value
    currencyValue: { type: Number, default: 0 }, // Added default value
    expenditure: { type: Number, default: 0 }, // Added default value
    budget: { type: Number, default: 0 }, // Added default value
    milestone_budget: { type: String, default: "" }, // Added default value
    research_place: { type: String, default: "" }, // Added default value
    resources: { type: String, default: "" }, // Added default value
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
ResearchProposalApplicationSchema.index({ userId: 1, applicationStatus: 1 });
ResearchProposalApplicationSchema.index({ createdAt: -1 });
ResearchProposalApplicationSchema.index({ applicationStatus: 1 });

module.exports = mongoose.model('ResearchProposalApplication', ResearchProposalApplicationSchema);