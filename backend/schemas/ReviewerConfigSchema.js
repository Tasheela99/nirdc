const mongoose = require('mongoose');

const ReviewerConfigSchema = new mongoose.Schema({
    // Only one document should exist in this collection
    singletonKey: { type: String, default: 'CONFIG', unique: true },
    trainingVideoUrl: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('ReviewerConfig', ReviewerConfigSchema);
