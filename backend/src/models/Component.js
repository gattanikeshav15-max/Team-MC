import mongoose from 'mongoose';

const maintenanceSubSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    action: { type: String, required: true },
    technician: { type: String, default: 'K. Gattani' },
    outcome: { type: String, default: 'Pass' },
  },
  { _id: false }
);

const componentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    partNumber: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    systemId: {
      type: String,
      required: true,
      ref: 'System',
      index: true,
    },
    systemName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Nominal', 'Degraded', 'Warning', 'Critical'],
      default: 'Nominal',
      index: true,
    },
    incidentCount: {
      type: Number,
      default: 0,
    },
    mtbfHours: {
      type: Number,
      default: 500000,
    },
    technicalSpecs: {
      voltageRating: { type: String, default: '' },
      continuousCurrent: { type: String, default: '' },
      onResistance: { type: String, default: '' },
      packageType: { type: String, default: '' },
      dielectric: { type: String, default: '' },
      tempRange: { type: String, default: '' },
      radiationHardness: { type: String, default: '' },
      core: { type: String, default: '' },
      flashMemory: { type: String, default: '' },
      sram: { type: String, default: '' },
      logicCells: { type: String, default: '' },
      dspSlices: { type: String, default: '' },
    },
    description: {
      type: String,
      default: '',
    },
    maintenanceHistory: [maintenanceSubSchema],
  },
  {
    timestamps: true,
  }
);

export const Component = mongoose.model('Component', componentSchema);
export default Component;

