const mongoose = require('mongoose');

const multiLangString = {
  en: { type: String, required: true, trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
};

const coreValueSchema = new mongoose.Schema({
  title: multiLangString,
  description: multiLangString,
  icon: { type: String, default: 'Sparkles', trim: true }, // Lucide icon identifier
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

coreValueSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('CoreValue', coreValueSchema);
