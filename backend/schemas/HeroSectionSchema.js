const mongoose = require('mongoose');

const multiLangString = {
  en: { type: String, required: true, trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
};

const heroButtonSchema = new mongoose.Schema({
  label: multiLangString,
  subLabel: {
    en: { type: String, default: '', trim: true },
    si: { type: String, default: '', trim: true },
    ta: { type: String, default: '', trim: true }
  },
  iconUrl: { type: String, default: '' },
  link: { type: String, default: '' }
}, { _id: true });

const heroSchema = new mongoose.Schema({
  preTitle: multiLangString,
  mainTitle: multiLangString,
  description: multiLangString,
  images: [{ type: String, required: true }],
  buttons: [heroButtonSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('HeroSection', heroSchema);
