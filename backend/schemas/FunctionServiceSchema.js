const mongoose = require('mongoose');

const multiLangSchema = new mongoose.Schema({
  en: { type: String, default: '', trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
}, { _id: false });

const functionServiceSchema = new mongoose.Schema({
  category: multiLangSchema, // e.g. "For Researchers & Inventors"
  description: multiLangSchema,
  offerings: [multiLangSchema],
  icon: { type: String, default: 'Lightbulb', trim: true },
  actionLink: { type: String, default: '', trim: true },
  actionText: multiLangSchema,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

functionServiceSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('FunctionService', functionServiceSchema);
