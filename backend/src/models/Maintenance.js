import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    componentId: {
      type: String,
      required: true,
      ref: 'Component',
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    technician: {
      type: String,
      default: 'K. Gattani',
    },
    outcome: {
      type: String,
      default: 'Pass',
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
export default Maintenance;

