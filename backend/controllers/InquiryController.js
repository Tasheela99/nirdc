const Inquiry = require('../schemas/InquirySchema');
const logger = require('../utils/LoggerUtil');

const createInquiry = async (req, res) => {
  try {
    const { name, email, subject, message, submissionMethod } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        status: false,
        message: 'Name, email, subject, and message are all required fields.'
      });
    }

    const inquiry = new Inquiry({
      name,
      email,
      subject,
      message,
      submissionMethod: submissionMethod === 'EMAIL_CLIENT' ? 'EMAIL_CLIENT' : 'APP'
    });

    await inquiry.save();
    logger.info('New contact inquiry submitted', { id: inquiry._id, email });

    return res.status(201).json({
      status: true,
      message: 'Inquiry submitted successfully.',
      data: inquiry
    });
  } catch (error) {
    logger.error('Error submitting inquiry:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to submit inquiry.',
      error: error.message
    });
  }
};

const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      data: inquiries
    });
  } catch (error) {
    logger.error('Error fetching inquiries:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch inquiries.',
      error: error.message
    });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ status: false, message: 'Inquiry not found' });
    }
    return res.status(200).json({ status: true, data: updated });
  } catch (error) {
    logger.error('Error updating inquiry status:', { error: error.message });
    return res.status(500).json({ status: false, message: 'Failed to update status', error: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ status: false, message: 'Inquiry not found' });
    }
    return res.status(200).json({ status: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    logger.error('Error deleting inquiry:', { error: error.message });
    return res.status(500).json({ status: false, message: 'Failed to delete inquiry', error: error.message });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
};
