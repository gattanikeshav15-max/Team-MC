import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
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
    chatId: {
      type: String,
      default: '',
      index: true,
    },
    uploadedBy: {
      type: String,
      default: 'researcher',
    },
    originalFilename: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    storageType: {
      type: String,
      enum: ['gridfs', 'disk'],
      default: 'gridfs',
    },
    gridfsFileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    storagePath: {
      type: String,
      default: '',
    },
    processingStatus: {
      type: String,
      enum: ['Uploaded', 'Processing', 'Extracted', 'Failed'],
      default: 'Uploaded',
    },
    extractedMemoriesCount: {
      type: Number,
      default: 0,
    },
    uploadDate: {
      type: String,
      default: () => new Date().toISOString().replace('T', ' ').substring(0, 19),
    },
  },
  {
    timestamps: true,
  }
);

export const Document = mongoose.model('Document', documentSchema);
export default Document;
