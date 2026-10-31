import mongoose from 'mongoose';

const messageSubSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    sender: { type: String, enum: ['user', 'vajra'], required: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    text: { type: String, required: true },
    retrievedMemories: { type: [mongoose.Schema.Types.Mixed], default: [] },
    uploadedDocuments: { type: [mongoose.Schema.Types.Mixed], default: [] },
    feedback: { type: String, default: null },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
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
    userId: {
      type: String,
      default: 'usr-default',
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'New Research Chat',
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString().replace('T', ' ').substring(0, 19),
    },
    messages: [messageSubSchema],
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
