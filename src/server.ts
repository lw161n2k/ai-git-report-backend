import dotenv from 'dotenv';
dotenv.config(); // BẮT BUỘC phải gọi dòng này đầu tiên

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.route';
import reportRoutes from './routes/report.route';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // Để server hiểu body định dạng JSON

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend Server đang chạy tại http://localhost:${PORT}`);
  console.log(`👉 Hãy thử gọi API POST http://localhost:${PORT}/api/auth/register`);
});
