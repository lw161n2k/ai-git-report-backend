# AI Git Report Backend 🚀

Đây là hệ thống Backend cho ứng dụng **AI Git Report**, được xây dựng bằng Node.js, Express và TypeScript. Hệ thống có nhiệm vụ cung cấp các API để xác thực người dùng và tích hợp AI nhằm tự động hóa việc viết báo cáo từ nội dung mã nguồn thay đổi (Git Diff).

## Tính Năng Chính ✨

*   **Kiến trúc MVC:** Cấu trúc dự án rõ ràng với Routes, Controllers, Middlewares.
*   **Authentication (JWT):** API đăng ký, đăng nhập và bảo vệ endpoint bằng JSON Web Token.
*   **Google OAuth2:** Hỗ trợ tính năng đăng nhập nhanh bằng tài khoản Google (sử dụng `google-auth-library`).
*   **AI Integration (Google Gemini):** API tiếp nhận `git diff`, sử dụng model Gemini 1.5 Flash để tự động phân tích và tạo báo cáo Changelog / Release Notes định dạng Markdown.
*   **Quản lý Prompts:** Quản lý System Prompts chuyên nghiệp và bảo mật ở phía server.

## Cài Đặt & Chạy Dự Án 🛠️

### 1. Yêu cầu
*   Node.js (>= 16.x)
*   npm hoặc yarn

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc của dự án và khai báo các biến sau:
```env
# Cổng chạy server
PORT=8080

# Secret Key để mã hóa JWT Token
JWT_SECRET="chuoi-bi-mat-cua-ban"

# Google Client ID (Dành cho Google Login)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# API Key của Google Gemini (Dành cho tính năng AI Report)
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Chạy dự án (Môi trường Development)
```bash
npm run dev
```
Server sẽ chạy mặc định tại: `http://localhost:8080`

## Danh Sách API Cơ Bản 🌐

### 1. Authentication
*   `POST /api/auth/register` - Đăng ký tài khoản
*   `POST /api/auth/login` - Đăng nhập bằng Username/Password
*   `POST /api/auth/google` - Đăng nhập bằng Google ID Token
*   `GET /api/auth/me` - Lấy thông tin User hiện tại (Yêu cầu Header: `Authorization: Bearer <token>`)

### 2. AI Report
*   `POST /api/report/generate` - Truyền lên `{ gitDiff }` (và tuỳ chọn `{ geminiKey }`) để AI phân tích và trả về báo cáo Markdown. (Yêu cầu Header: `Authorization: Bearer <token>`)

## Cấu Trúc Thư Mục 📂
\`\`\`
src/
├── config/        # Chứa cấu hình, thiết lập các AI Prompts
├── controllers/   # Nơi chứa logic xử lý chính của các API
├── middlewares/   # Các hàm trung gian (ví dụ: verifyToken)
├── routes/        # Định nghĩa các đường dẫn API
└── server.ts      # File khởi chạy server Express
\`\`\`
