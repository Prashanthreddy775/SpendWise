import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import expenseRoutes from './routes/expenseRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/expenses', expenseRoutes);

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok', message: 'SpendWise API is running.' });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`SpendWise server is listening on port ${port}.`);
  connectDatabase();
});