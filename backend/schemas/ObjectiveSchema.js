const mongoose = require('mongoose');

const multiLangString = {
  en: { type: String, required: true, trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
};

const optionalMultiLangString = {
  en: { type: String, default: '', trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
};

const objectiveSchema = new mongoose.Schema({
  badge: optionalMultiLangString, // e.g. "Economic Growth", "Tech Sovereignty"
  title: multiLangString,
  description: multiLangString,
  icon: { type: String, default: 'Target', trim: true }, // Lucide icon identifier
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

objectiveSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('Objective', objectiveSchema);
