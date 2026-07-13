import { Router } from 'express';
import { generateReport } from '../controllers/report.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Yêu cầu đăng nhập mới được gọi API sinh báo cáo
router.post('/generate', verifyToken, generateReport);

export default router;
