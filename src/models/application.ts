import { Schema, model, Document } from 'mongoose';

interface IApplication extends Document {
  user_id: string;
  application_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  vehicle_type: 'suv' | 'compact' | 'truck' | 'motorcycle';
}

const applicationSchema = new Schema<IApplication>({
  user_id: { type: String, required: true },
  application_id: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], required: true },
  vehicle_type: { type: String, enum: ['suv', 'compact', 'truck', 'motorcycle'], required: true }
}, {
  timestamps: true
});

const Application = model<IApplication>('Application', applicationSchema);

export default Application;