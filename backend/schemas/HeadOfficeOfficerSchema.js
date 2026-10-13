const mongoose = require('mongoose');

const multiLangString = {
  en: { type: String, default: '', trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
};

const headOfficeOfficerSchema = new mongoose.Schema({
  name: multiLangString,
  designation: multiLangString,
  division: multiLangString,
  generalNumber: { type: String, default: '', trim: true },
  mobileNumber: { type: String, default: '', trim: true },
  email: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

headOfficeOfficerSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('HeadOfficeOfficer', headOfficeOfficerSchema);
