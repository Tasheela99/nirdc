const mongoose = require('mongoose');

const multiLangSchema = new mongoose.Schema({
  en: { type: String, default: '', trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
}, { _id: false });

const organizationalDivisionSchema = new mongoose.Schema({
  title: multiLangSchema,
  focus: multiLangSchema,
  subUnits: [multiLangSchema],
  icon: { type: String, default: 'Building', trim: true }, // Lucide icon identifier
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

organizationalDivisionSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('OrganizationalStructure', organizationalDivisionSchema);
