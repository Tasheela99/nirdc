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

const teamMemberSchema = new mongoose.Schema({
  name: multiLangString,
  role: multiLangString,
  division: optionalMultiLangString,
  bio: multiLangString,
  initials: { type: String, default: '', trim: true },
  color: { type: String, default: 'from-purple-600 to-pink-600', trim: true },
  image: { type: String, default: null }, // profile photo URL if available
  phone: { type: String, default: '', trim: true },
  email: { type: String, default: '', trim: true },
  linkedin: { type: String, default: '', trim: true },
  badge: optionalMultiLangString, // e.g. "Executive Lead"
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

teamMemberSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
