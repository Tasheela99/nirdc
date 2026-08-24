const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    slug: { type: String, unique: true, sparse: true },
    titleEn: { type: String, default: '' },
    titleSi: { type: String, default: '' },
    titleTa: { type: String, default: '' },
    contentEn: { type: String, default: '' },
    contentSi: { type: String, default: '' },
    contentTa: { type: String, default: '' },
    imageEn: { type: String, default: null },
    imageSi: { type: String, default: null },
    imageTa: { type: String, default: null },
    commonImage: { type: String, required: true },
    date: { type: String, required: true },
    activeState: { type: Boolean, default: true },
}, { timestamps: true });

// Performance indexes
NewsSchema.index({ createdAt: -1 });
NewsSchema.index({ activeState: 1, createdAt: -1 });

module.exports = mongoose.model('News', NewsSchema);
