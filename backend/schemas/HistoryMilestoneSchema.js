const mongoose = require('mongoose');

const multiLangString = {
  en: { type: String, required: true, trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
};

const historyMilestoneSchema = new mongoose.Schema({
  year: { type: String, required: true, trim: true }, // e.g. "2020", "2025 & Beyond"
  title: multiLangString,
  description: multiLangString,
  icon: { type: String, default: 'History' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

historyMilestoneSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('HistoryMilestone', historyMilestoneSchema);
