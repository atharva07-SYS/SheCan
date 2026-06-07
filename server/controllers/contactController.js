const Message = require('../models/Message');
const ActivityLog = require('../models/ActivityLog');
const { sendConfirmationEmail, sendAdminNotification } = require('../services/emailService');
const { createObjectCsvStringifier } = require('csv-writer');

/**
 * @desc    Create a new contact message
 * @route   POST /api/contact
 * @access  Public
 */
const createMessage = async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message, category } = req.body;

    // Validate required fields
    if (!fullName || !email || !subject || !message || !category) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (fullName, email, subject, message, category).',
      });
    }

    // Create the message
    const newMessage = await Message.create({
      fullName,
      email,
      phone,
      subject,
      message,
      category,
    });

    // Trigger emails asynchronously (non-blocking)
    sendConfirmationEmail(newMessage.email, newMessage.fullName, newMessage.inquiryId);
    sendAdminNotification(newMessage);

    res.status(201).json({
      success: true,
      data: newMessage,
      inquiryId: newMessage.inquiryId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all messages with pagination, search, filtering, and sorting
 * @route   GET /api/contact
 * @access  Private (Admin)
 */
const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sort || '-createdAt';

    // Build query filter
    const filter = {};

    // Search across fullName, email, inquiryId
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { inquiryId: searchRegex },
      ];
    }

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Execute query with pagination
    const total = await Message.countDocuments(filter);
    const messages = await Message.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single message by ID
 * @route   GET /api/contact/:id
 * @access  Private (Admin)
 */
const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update message (status, etc.)
 * @route   PUT /api/contact/:id
 * @access  Private (Admin)
 */
const updateMessage = async (req, res, next) => {
  try {
    let message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found.',
      });
    }

    const previousStatus = message.status;

    message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Create activity log entry
    const logDetails = req.body.status
      ? `Status changed from "${previousStatus}" to "${req.body.status}"`
      : `Message updated`;

    await ActivityLog.create({
      action: 'Updated status',
      performedBy: req.user._id,
      targetMessage: message.inquiryId,
      details: logDetails,
    });

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete message
 * @route   DELETE /api/contact/:id
 * @access  Private (Admin)
 */
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found.',
      });
    }

    const inquiryId = message.inquiryId;

    await Message.findByIdAndDelete(req.params.id);

    // Create activity log entry
    await ActivityLog.create({
      action: 'Deleted message',
      performedBy: req.user._id,
      targetMessage: inquiryId,
      details: `Deleted message from ${message.fullName} (${message.email})`,
    });

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export messages as CSV
 * @route   GET /api/contact/export/csv
 * @access  Private (Admin)
 */
const exportCSV = async (req, res, next) => {
  try {
    // Build query filter
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const messages = await Message.find(filter).sort('-createdAt');

    // Define CSV headers
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'inquiryId', title: 'Inquiry ID' },
        { id: 'fullName', title: 'Full Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'subject', title: 'Subject' },
        { id: 'message', title: 'Message' },
        { id: 'category', title: 'Category' },
        { id: 'status', title: 'Status' },
        { id: 'createdAt', title: 'Date Submitted' },
      ],
    });

    // Build CSV records
    const records = messages.map((msg) => ({
      inquiryId: msg.inquiryId,
      fullName: msg.fullName,
      email: msg.email,
      phone: msg.phone || '',
      subject: msg.subject,
      message: msg.message.replace(/(\r\n|\n|\r)/gm, ' '),
      category: msg.category,
      status: msg.status,
      createdAt: msg.createdAt.toISOString(),
    }));

    const csvContent =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records);

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="shecan-messages-${Date.now()}.csv"`
    );

    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
  exportCSV,
};
