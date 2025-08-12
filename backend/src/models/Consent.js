import mongoose from 'mongoose';

const ConsentSchema = new mongoose.Schema({
  principal_identifier: { type: String, index: true },
  categories: {
    essential: { type: Boolean, default: true },
    functional: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false }
  },
  action: { type: String, enum: ['accept', 'reject', 'withdraw', 'partial'], required: true },
  consent_text: { type: String },
  ip: { type: String },
  user_agent: { type: String },
  meta: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

ConsentSchema.index({ principal_identifier: 1, createdAt: -1 });
ConsentSchema.index({ createdAt: -1 });

export default mongoose.model('Consent', ConsentSchema);
