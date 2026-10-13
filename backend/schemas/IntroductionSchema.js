const mongoose = require('mongoose');

const multiLangSchema = new mongoose.Schema({
  en: { type: String, default: '', trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
}, { _id: false });

const introductionSchema = new mongoose.Schema({
  badge: multiLangSchema,
  title: multiLangSchema,
  subtitle: multiLangSchema,
  overviewTitle: multiLangSchema,
  overviewHeading: multiLangSchema,
  paragraphs: [multiLangSchema],
  image: { type: String, default: null }, // image URL or asset path
  imageCaption: multiLangSchema,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

introductionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Introduction', introductionSchema);
