const mongoose = require('mongoose');

const DownloadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: String, required: true },
    activeState: { type: Boolean, default: true },
}, { timestamps: true });

DownloadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Download', DownloadSchema);
