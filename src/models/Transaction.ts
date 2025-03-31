import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, enum: ['USD', 'NGN'] }, // Extend as needed
    fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, 
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', TransactionSchema);
