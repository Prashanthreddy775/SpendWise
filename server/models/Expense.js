import mongoose from 'mongoose';

export const expenseCategories = [
  'Food',
  'Travel',
  'Education',
  'Shopping',
  'Entertainment',
  'Health',
  'Other',
];

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      maxlength: [100, 'Title must be 100 characters or fewer.'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required.'],
      min: [0.01, 'Amount must be greater than zero.'],
      max: [1000000000, 'Amount is too large.'],
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      enum: {
        values: expenseCategories,
        message: 'Choose a valid expense category.',
      },
    },
    date: {
      type: Date,
      required: [true, 'Date is required.'],
      validate: {
        validator: (value) => !Number.isNaN(value.getTime()),
        message: 'Enter a valid date.',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be 500 characters or fewer.'],
      default: '',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Expense', expenseSchema);