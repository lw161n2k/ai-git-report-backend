import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPTS, buildGitReportUserPrompt } from '../config/prompts';

export const generateReport = async (req: any, res: any) => {
  try {
    const { gitDiff, geminiKey } = req.body;

    if (!gitDiff) {
      return res.status(400).json({ message: 'Vui lòng cung cấp nội dung gitDiff' });
    }

    // 1. Lấy API Key từ biến môi trường hoặc từ client truyền lên
    const apiKey = geminiKey || process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
      return res.status(400).json({ 
        message: 'Hệ thống chưa cấu hình GEMINI_API_KEY. Vui lòng cấu hình .env hoặc truyền geminiKey từ client.' 
      });
    }

    // 2. Chuẩn bị Prompts
    const systemPrompt = SYSTEM_PROMPTS.GIT_REPORT;
    const userPrompt = buildGitReportUserPrompt(gitDiff);

    console.log("=== ĐANG GỌI API GEMINI ===");
    
    // 3. Khởi tạo và gọi Google Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt // Truyền system prompt vào config của model
    });

    const result = await model.generateContent(userPrompt);
    let aiReportText = result.response.text();
    
    // Làm sạch kết quả trả về nếu có block markdown dư thừa
    aiReportText = aiReportText.replace(/```markdown/g, '').replace(/```/g, '').trim();

    res.status(200).json({
      message: 'Tạo báo cáo thành công',
      report: aiReportText
    });

  } catch (error: any) {
    console.error("Lỗi tạo báo cáo AI:", error);
    res.status(500).json({ 
      message: 'Lỗi server khi tạo báo cáo AI',
      error: error.message 
    });
  }
};
