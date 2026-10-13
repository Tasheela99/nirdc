const mongoose = require('mongoose');

const multiLangSchema = new mongoose.Schema({
    en: { type: String, default: '', trim: true },
    si: { type: String, default: '', trim: true },
    ta: { type: String, default: '', trim: true }
}, { _id: false });

const DownloadSchema = new mongoose.Schema({
    title: multiLangSchema,
    categoryKey: {
        type: String,
        enum: ['CIRCULAR', 'REPORT', 'ETHICS', 'DOCUMENT', 'APPLICATION', 'OTHER'],
        default: 'CIRCULAR',
        index: true
    },
    category: multiLangSchema,
    description: multiLangSchema,
    fileUrl: { type: String, required: true, trim: true },
    fileName: { type: String, default: '', trim: true },
    fileType: { type: String, default: 'PDF', trim: true },
    fileSize: { type: String, default: '0 MB', trim: true },
    documentNumber: { type: String, default: '', trim: true }, // e.g., Circular Ref / Document Code
    publishDate: { type: Date, default: Date.now },
    downloadCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    activeState: { type: Boolean, default: true, index: true },
}, { timestamps: true });

DownloadSchema.index({ activeState: 1, categoryKey: 1, order: 1, createdAt: -1 });

module.exports = mongoose.model('Download', DownloadSchema);
