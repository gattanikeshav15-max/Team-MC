import mongoose from 'mongoose';
import { Readable } from 'stream';

let gridFSBucket = null;

export const getGridFSBucket = () => {
  if (!gridFSBucket && mongoose.connection.readyState === 1) {
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'documents',
    });
  }
  return gridFSBucket;
};

export const gridFSService = {
  /**
   * Upload a buffer directly to MongoDB GridFS
   */
  async uploadFile(buffer, filename, mimetype) {
    const bucket = getGridFSBucket();
    if (!bucket) throw new Error('GridFS bucket not initialized (database disconnected).');

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(buffer);
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: mimetype,
      });

      readableStream
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => {
          resolve({
            fileId: uploadStream.id,
            filename,
            length: uploadStream.length,
          });
        });
    });
  },

  /**
   * Read file buffer back from MongoDB GridFS
   */
  async downloadFile(fileId) {
    const bucket = getGridFSBucket();
    if (!bucket) throw new Error('GridFS bucket not initialized.');

    return new Promise((resolve, reject) => {
      const chunks = [];
      const objectId = typeof fileId === 'string' ? new mongoose.Types.ObjectId(fileId) : fileId;
      const downloadStream = bucket.openDownloadStream(objectId);

      downloadStream
        .on('data', (chunk) => chunks.push(chunk))
        .on('error', reject)
        .on('end', () => {
          resolve(Buffer.concat(chunks));
        });
    });
  },

  /**
   * Delete file from GridFS
   */
  async deleteFile(fileId) {
    const bucket = getGridFSBucket();
    if (!bucket) return;
    const objectId = typeof fileId === 'string' ? new mongoose.Types.ObjectId(fileId) : fileId;
    await bucket.delete(objectId);
  },
};

export default gridFSService;
