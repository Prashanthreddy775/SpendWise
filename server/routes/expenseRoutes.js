import { Router } from 'express';
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
} from '../controllers/expenseController.js';
import { requireDatabase } from '../config/database.js';

const router = Router();

router.use(requireDatabase);
router.get('/', getExpenses);
router.get('/:id', getExpense);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;