import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
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
      required: [true, 'Project name is required'],
      trim: true,
    },
    researchArea: {
      type: String,
      required: [true, 'Research area is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    teamName: {
      type: String,
      required: [true, 'Research team name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Archived'],
      default: 'In Progress',
      index: true,
    },
    leadResearcher: {
      type: String,
      default: 'Dr. Keshav Gattani',
    },
    createdDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    completionDate: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model('Project', projectSchema);
export default Project;

