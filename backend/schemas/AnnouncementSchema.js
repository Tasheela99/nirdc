const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    slug: { type: String, unique: true, sparse: true },
    titleEn: { type: String, default: '' },
    titleSi: { type: String, default: '' },
    titleTa: { type: String, default: '' },
    descriptionEn: { type: String, default: '' },
    descriptionSi: { type: String, default: '' },
    descriptionTa: { type: String, default: '' },
    imageEn: { type: String, default: null },
    imageSi: { type: String, default: null },
    imageTa: { type: String, default: null },
    commonImage: { type: String, required: true },
    pdfEn: { type: String, default: null },
    pdfSi: { type: String, default: null },
    pdfTa: { type: String, default: null },
    date: { type: String, required: true },
}, { timestamps: true });

// Performance indexes
AnnouncementSchema.index({ createdAt: -1 });
AnnouncementSchema.index({ date: -1 });

module.exports = mongoose.model('Announcement', AnnouncementSchema);