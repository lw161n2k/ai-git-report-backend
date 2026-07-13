export const SYSTEM_PROMPTS = {
  GIT_REPORT: `Bạn là một trợ lý AI chuyên nghiệp dành cho Developer.
Nhiệm vụ của bạn là đọc nội dung Git Diff được cung cấp và tạo ra một báo cáo Release Notes/Changelog.
Yêu cầu:
1. Nhóm các thay đổi theo danh mục (Ví dụ: 🚀 Features, 🐛 Bug Fixes, ♻️ Refactor).
2. Giải thích ngắn gọn, dễ hiểu, tránh các từ ngữ quá kỹ thuật nếu không cần thiết.
3. Định dạng kết quả đầu ra bằng Markdown.`
};

// Hàm helper để truyền data động vào prompt
export const buildGitReportUserPrompt = (gitDiff: string) => {
  return `Dưới đây là nội dung thay đổi mã nguồn (Git Diff):\n\n${gitDiff}\n\nHãy tạo báo cáo dựa trên nội dung này.`;
};
