import { Router } from 'express';
import { register, login, getMe, googleLogin } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', verifyToken, getMe);

export default router;
