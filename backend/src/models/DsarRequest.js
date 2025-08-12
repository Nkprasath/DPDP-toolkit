import mongoose from 'mongoose';

const DsarSchema = new mongoose.Schema({
  principal_identifier: { type: String, required: true, index: true },
  contact: {
    email: { type: String },
    phone: { type: String },
    name: { type: String }
  },
  type: { type: String, enum: ['access', 'delete', 'rectify'], required: true },
  details: { type: String },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

DsarSchema.index({ principal_identifier: 1, createdAt: -1 });

export default mongoose.model('DsarRequest', DsarSchema);
