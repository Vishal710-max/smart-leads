import mongoose, { Document, Schema } from 'mongoose';
import { ILead, LeadStatus, LeadSource } from '../types/lead';

export interface ILeadDocument extends ILead, Document {}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.New,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: [true, 'Source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

LeadSchema.index({ name: 'text', email: 'text' });
LeadSchema.index({ status: 1, source: 1, createdAt: -1 });

export const Lead = mongoose.model<ILeadDocument>('Lead', LeadSchema);
