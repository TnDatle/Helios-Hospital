import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const hospitalData = `
BỆNH VIỆN HELIOS VIỆT NAM

=== GIỜ LÀM VIỆC ===
- Thứ 2 – Thứ 6: 06:00 – 16:00
- Thứ 7, Lễ tết: 06:00 – 11:30
- Chủ nhật: Nghỉ
- Tiếp nhận cấp cứu: 24/7

=== CÁC KHOA ===
- Khoa Ngoại tổng quát
- Khoa Ngoại tiết niệu
- Khoa Nội soi tiêu hóa
- Khoa Lọc máu - Nội thận
- Khoa Tim mạch - Mạch máu
- Khoa Xét nghiệm
- Khoa Nội soi niệu
- Khoa Ung bướu

=== DỊCH VỤ ===
- Khám tổng quát
- Khám chuyên khoa
- Xét nghiệm máu
- Siêu âm
- Chụp X-quang
- Tư vấn thuốc
- Phẫu thuật trong ngày
- Hỗ trợ xuất viện sớm
- Xe vận chuyển

=== QUY TRÌNH ĐẶT LỊCH KHÁM ===
1. Người dùng cần tạo tài khoản và cung cấp thông tin cần thiết trên đó.
2. Người bệnh lựa chọn khoa và sau đó chọn bác sĩ theo chuyên khoa muốn khám.
3. Lựa chọn ngày khám và khung giờ mong muốn.
4. Cung cấp thông tin người bệnh.
5. Sẽ có tin nhắn từ Bệnh viện Helios gửi đến số điện thoại để xác nhận lịch hẹn.
6. Người bệnh đến bệnh viện trước giờ hẹn 15 phút để làm thủ tục.
`;


router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
        role: "system",
        content: `
      Bạn là trợ lý ảo của Bệnh viện Helios Việt Nam.

      Dưới đây là thông tin CHÍNH THỨC của bệnh viện:
      ${hospitalData}

      QUY ĐỊNH BẮT BUỘC:
      - Chỉ sử dụng thông tin trong hospitalData để trả lời.
      - Trả lời bằng MARKDOWN.
      - Dùng tiêu đề (##) và danh sách (- hoặc 1.).
      - Mỗi ý xuống dòng, không viết đoạn văn dài.
      - Không bịa thêm thông tin ngoài hospitalData.

      Nếu không có thông tin, trả lời đúng câu:
      "Hiện chưa có thông tin."
      `
      },
        { role: "user", content: message },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Hệ thống đang bận, vui lòng thử lại." });
  }
});

export default router;
