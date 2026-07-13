import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_123';

export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Format: Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Không có quyền truy cập. Vui lòng cung cấp token.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
