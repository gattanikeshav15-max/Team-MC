import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
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
    componentName: {
      type: String,
      default: '',
    },
    systemId: {
      type: String,
      required: true,
      ref: 'System',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      default: '',
    },
    severity: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'High',
      index: true,
    },
    status: {
      type: String,
      enum: ['Under Investigation', 'Action Required', 'Investigated', 'Resolved'],
      default: 'Under Investigation',
      index: true,
    },
    reportedDate: {
      type: String,
      default: () => new Date().toISOString().replace('T', ' ').substring(0, 19),
    },
    environmentalConditions: {
      type: String,
      default: 'Ambient lab test conditions (25°C, 1 atm)',
    },
    notes: {
      type: String,
      default: '',
    },
    outcome: {
      type: String,
      default: 'Pending engineering root-cause review.',
    },
    assignedEngineer: {
      type: String,
      default: 'Keshav Gattani',
    },
  },
  {
    timestamps: true,
  }
);

export const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;
