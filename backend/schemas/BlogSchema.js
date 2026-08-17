const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
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
    date: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Blogs', BlogSchema);
