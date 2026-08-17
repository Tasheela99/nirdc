const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Vacancy', 'Tender', 'Event', 'General'],
        default: 'General',
        required: true
    },
    imageUrl: { type: String, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    showAsPopup: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Performance indexes
AdSchema.index({ startDate: 1, endDate: 1 });
AdSchema.index({ status: 1 });
AdSchema.index({ showAsPopup: 1 });
AdSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ad', AdSchema);
