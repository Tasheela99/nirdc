const mongoose = require('mongoose');

const multiLangSchema = new mongoose.Schema({
  en: { type: String, default: '', trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
}, { _id: false });

const directorMessageSchema = new mongoose.Schema({
  badge: multiLangSchema,
  quote: multiLangSchema,
  directorName: multiLangSchema,
  directorRole: multiLangSchema,
  directorImage: { type: String, default: null },
  credentials: [multiLangSchema], // e.g. ["Statutory Apex Authority", "Presidential Secretariat Alignment"]
  messageTitle: multiLangSchema,
  paragraphs: [multiLangSchema],
  signoffName: multiLangSchema,
  signoffRole: multiLangSchema,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

directorMessageSchema.index({ isActive: 1 });

module.exports = mongoose.model('DirectorMessage', directorMessageSchema);
