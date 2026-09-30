import mongoose from 'mongoose';
import Expense from '../models/Expense.js';

function asyncHandler(controller) {
  return (request, response, next) => {
    Promise.resolve(controller(request, response, next)).catch(next);
  };
}

function validateExpenseId(request, response, next) {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ message: 'The expense ID is invalid.' });
  }

  next();
}

function isValidDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateDate(request, response) {
  if (request.body.date !== undefined && !isValidDateOnly(request.body.date)) {
    response.status(400).json({ message: 'Enter a valid date in YYYY-MM-DD format.' });
    return false;
  }

  return true;
}

export const getExpenses = asyncHandler(async (request, response) => {
  const { search = '', category = '', month = '' } = request.query;
  const filter = {};

  if (search.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.title = { $regex: escapedSearch, $options: 'i' };
  }

  if (category) {
    filter.category = category;
  }

  if (month) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return response.status(400).json({ message: 'Month must use the YYYY-MM format.' });
    }

    const [year, monthNumber] = month.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, monthNumber - 1, 1));
    const endDate = new Date(Date.UTC(year, monthNumber, 1));

    if (monthNumber < 1 || monthNumber > 12) {
      return response.status(400).json({ message: 'Choose a valid month.' });
    }

    filter.date = { $gte: startDate, $lt: endDate };
  }

  const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
  response.json(expenses);
});

export const getExpense = [
  validateExpenseId,
  asyncHandler(async (request, response) => {
    const expense = await Expense.findById(request.params.id);

    if (!expense) {
      return response.status(404).json({ message: 'Expense not found.' });
    }

    response.json(expense);
  }),
];

export const createExpense = asyncHandler(async (request, response) => {
  if (!validateDate(request, response)) return;
  const expense = await Expense.create(request.body);
  response.status(201).json(expense);
});

export const updateExpense = [
  validateExpenseId,
  asyncHandler(async (request, response) => {
    if (!validateDate(request, response)) return;
    const expense = await Expense.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return response.status(404).json({ message: 'Expense not found.' });
    }

    response.json(expense);
  }),
];

export const deleteExpense = [
  validateExpenseId,
  asyncHandler(async (request, response) => {
    const expense = await Expense.findByIdAndDelete(request.params.id);

    if (!expense) {
      return response.status(404).json({ message: 'Expense not found.' });
    }

    response.json({ message: 'Expense deleted successfully.' });
  }),
];