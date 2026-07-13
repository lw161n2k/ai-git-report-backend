import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_123';

// GIẢ LẬP DATABASE (In-memory array)
// Trong thực tế, bạn sẽ dùng Mongoose (MongoDB) hoặc Prisma (PostgreSQL)
const usersDB: any[] = []; 

export const register = async (req: any, res: any) => {
  try {
    const { username, password, fullName } = req.body;

    if (!username || !password) {
       res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu' });
       return;
    }

    // Kiểm tra user tồn tại chưa
    const existingUser = usersDB.find((u: any) => u.username === username);
    if (existingUser) {
       res.status(400).json({ message: 'Tài khoản đã tồn tại' });
       return;
    }

    // Mã hóa mật khẩu (Hash password)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Lưu vào "Database"
    const newUser = {
      id: Date.now().toString(),
      username,
      fullName,
      password: hashedPassword
    };
    usersDB.push(newUser);

    res.status(201).json({ message: 'Đăng ký thành công!', userId: newUser.id });
  } catch (error) {
     res.status(500).json({ message: 'Lỗi server' });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    // Tìm user trong Database
    const user = usersDB.find((u: any) => u.username === username);
    if (!user) {
       res.status(400).json({ message: 'Tài khoản không tồn tại' });
       return;
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       res.status(400).json({ message: 'Sai mật khẩu' });
       return;
    }

    // Nếu đúng -> Tạo vé (JWT Token)
    const token = jwt.sign(
      { userId: user.id, username: user.username, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: '1d' } // Hết hạn sau 1 ngày
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName
      }
    });

  } catch (error) {
     res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getMe = (req: any, res: any) => {
  res.json({
    message: 'Bạn đã xác thực thành công!',
    user: req.user
  });
};

export const googleLogin = async (req: any, res: any) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Vui lòng cung cấp Google ID Token' });
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID) {
       return res.status(500).json({ message: 'Chưa cấu hình GOOGLE_CLIENT_ID trên server' });
    }

    // 1. Backend xác minh Token với Server của Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    
    // 2. Lấy thông tin user từ Google
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: 'Token không hợp lệ' });

    const { sub, email, name, picture } = payload;

    // 3. Xử lý User trong Database
    let user = usersDB.find((u: any) => u.email === email);
    if (!user) {
       user = {
         id: sub, // Dùng Google ID làm ID
         username: email,
         email: email,
         fullName: name,
         avatar: picture,
         password: '', // User Google không có mật khẩu hệ thống
       };
       usersDB.push(user);
    }

    // 4. Cấp phát JWT Token nội bộ
    const token = jwt.sign(
      { userId: user.id, username: user.username, fullName: user.fullName, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Đăng nhập Google thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar
      }
    });

  } catch (error) {
     console.error('Lỗi đăng nhập Google:', error);
     res.status(500).json({ message: 'Lỗi xác thực Google Token' });
  }
};

