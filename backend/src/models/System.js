import mongoose from 'mongoose';

const systemSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    componentCount: {
      type: Number,
      default: 0,
    },
    registrationDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    status: {
      type: String,
      enum: ['Nominal', 'Degraded', 'Under Maintenance', 'Critical'],
      default: 'Nominal',
    },
    reliabilityScore: {
      type: Number,
      default: 98.0,
    },
    location: {
      type: String,
      default: 'Electronics Bay A',
    },
    leadEngineer: {
      type: String,
      default: 'Keshav Gattani',
    },
    environment: {
      type: String,
      default: 'Standard Aerospace / Defense Spec (-55°C to +85°C)',
    },
  },
  {
    timestamps: true,
  }
);

export const System = mongoose.model('System', systemSchema);
export default System;
