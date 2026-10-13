const mongoose = require('mongoose');

const multiLangString = {
  en: { type: String, default: '', trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
};

const contactSchema = new mongoose.Schema({
  organizationName: multiLangString,
  location: {
    title: multiLangString,
    address: multiLangString
  },
  email: {
    title: multiLangString,
    address: { type: String, default: '', trim: true }
  },
  telephone: {
    title: multiLangString,
    number: { type: String, default: '', trim: true }
  },
  fax: {
    title: multiLangString,
    number: { type: String, default: '', trim: true }
  },
  workingHours: {
    title: multiLangString,
    schedule: multiLangString
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactSchema);
