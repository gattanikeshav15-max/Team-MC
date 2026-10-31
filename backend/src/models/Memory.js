import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    projectId: {
      type: String,
      required: true,
      ref: 'Project',
      index: true,
    },
    projectName: {
      type: String,
      default: '',
    },
    teamName: {
      type: String,
      default: '',
    },
    chatId: {
      type: String,
      default: '',
      index: true,
    },
    documentId: {
      type: String,
      default: '',
      index: true,
    },
    documentName: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Research Objective',
        'Observation',
        'Successful Experiment',
        'Failed Experiment',
        'Engineering Decision',
        'Technical Limitation',
        'Lesson Learned',
        'Unresolved Question',
      ],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Memory content text is mandatory'],
    },
    sourceSection: {
      type: String,
      default: 'Section 1.0',
    },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Unverified', 'Corrected', 'Archived'],
      default: 'Unverified',
      index: true,
    },
    confidence: {
      type: Number,
      default: 88,
      min: 0,
      max: 100,
    },
    embedding: {
      type: [Number],
      default: [],
      select: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    verifiedBy: {
      type: String,
      default: 'Pending Peer Review',
    },
    createdDate: {
      type: String,
      default: () => new Date().toISOString().replace('T', ' ').substring(0, 19),
    },
  },
  {
    timestamps: true,
  }
);

memorySchema.index({ content: 'text', category: 'text', tags: 'text' });

export const Memory = mongoose.model('Memory', memorySchema);
export default Memory;
