const mongoose = require('mongoose');

const multiLangSchema = new mongoose.Schema({
  en: { type: String, default: '', trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
}, { _id: false });

const responsibilitySchema = new mongoose.Schema({
  section: multiLangSchema, // e.g. "Mandate 01"
  title: multiLangSchema,
  points: [multiLangSchema],
  icon: { type: String, default: 'ShieldCheck', trim: true }, // Lucide icon identifier
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

responsibilitySchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('Responsibility', responsibilitySchema);
