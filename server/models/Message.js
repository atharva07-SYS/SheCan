const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const messageSchema = new mongoose.Schema(
  {
    inquiryId: {
      type: String,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Volunteer', 'Donation', 'Partnership', 'General Inquiry'],
        message: '{VALUE} is not a valid category',
      },
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved', 'Archived'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-generate inquiryId if not set
messageSchema.pre('save', async function (next) {
  if (!this.inquiryId) {
    let id;
    let exists = true;

    // Ensure uniqueness by checking for collisions
    while (exists) {
      id = generateId();
      const existing = await mongoose.models.Message.findOne({ inquiryId: id });
      exists = !!existing;
    }

    this.inquiryId = id;
  }

  next();
});

module.exports = mongoose.model('Message', messageSchema);
