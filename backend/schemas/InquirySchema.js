const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  submissionMethod: {
    type: String,
    enum: ['APP', 'EMAIL_CLIENT'],
    default: 'APP'
  },
  status: {
    type: String,
    enum: ['PENDING', 'REVIEWED', 'RESPONDED'],
    default: 'PENDING'
  }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
