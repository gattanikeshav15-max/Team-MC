import mongoose from 'mongoose';

const auditEntrySchema = new mongoose.Schema(
  {
    previousContent: { type: String, required: true },
    reason: { type: String, required: true },
    correctedBy: { type: String, default: 'Keshav Gattani' },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const memorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    systemId: {
      type: String,
      default: '',
      index: true,
    },
    componentId: {
      type: String,
      required: true,
      ref: 'Component',
      index: true,
    },
    componentName: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: true,
      enum: [
        'Observation Memory',
        'Failure Memory',
        'Maintenance Memory',
        'Environmental Memory',
        'Decision Memory',
        'Outcome Memory',
      ],
      index: true,
    },
    category: {
      type: String,
      default: function () {
        return this.type;
      },
    },
    content: {
      type: String,
      required: [true, 'Memory content text is mandatory'],
    },
    sourceType: {
      type: String,
      default: 'Incident',
    },
    sourceId: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: '',
    },
    confidence: {
      type: Number,
      default: 85,
      min: 0,
      max: 100,
    },
    importance: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'High',
    },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Unverified', 'Corrected', 'Archived'],
      default: 'Unverified',
      index: true,
    },
    embedding: {
      type: [Number],
      default: [],
      select: true, // Retain embedding array for vector cosine distance calculations
    },
    tags: {
      type: [String],
      default: [],
    },
    verifiedBy: {
      type: String,
      default: 'Pending Peer Review',
    },
    notes: {
      type: String,
      default: '',
    },
    correctionAuditTrail: [auditEntrySchema],
    createdDate: {
      type: String,
      default: () => new Date().toISOString().replace('T', ' ').substring(0, 19),
    },
    expiresAt: {
      type: Date,
      default: null, // TTL expiration for transient observation memories
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB Text index for fallback hybrid keyword search
memorySchema.index({ content: 'text', componentName: 'text', tags: 'text' });

export const Memory = mongoose.model('Memory', memorySchema);
export default Memory;
