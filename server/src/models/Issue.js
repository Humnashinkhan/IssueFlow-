import mongoose from 'mongoose';
import {
  ISSUE_STATUSES,
  ISSUE_PRIORITIES,
  ISSUE_TYPES,
} from '../utils/constants.js';

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: { values: ISSUE_STATUSES, message: 'Invalid status' },
      default: 'Open',
    },
    priority: {
      type: String,
      enum: { values: ISSUE_PRIORITIES, message: 'Invalid priority' },
      default: 'Medium',
    },
    type: {
      type: String,
      enum: { values: ISSUE_TYPES, message: 'Invalid type' },
      default: 'Bug',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

issueSchema.index({ createdAt: -1 });
issueSchema.index({ status: 1, createdAt: -1 });
issueSchema.index({ createdBy: 1 });

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;