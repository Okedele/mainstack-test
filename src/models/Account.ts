import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, enum: ['USD', 'NGN'] }, // Extend as needed
  },
  { timestamps: true }
);

export default mongoose.model('Account', AccountSchema);
