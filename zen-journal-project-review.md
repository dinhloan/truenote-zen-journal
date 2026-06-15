# Review nhanh source Zen Journal

## Tình trạng hiện tại

Source export từ AI Studio đang là React + TypeScript + Vite, không phải HTML thuần. Đây là lựa chọn tốt để đưa cho Codex vì đã có cấu trúc component sẵn.

## Đã chỉnh nhẹ trong bản này

- Đổi tên package thành `zen-journal-stitch-app`.
- Làm sạch dependencies không dùng tới như Gemini/Express/Motion.
- Sửa lỗi chữ: `năng lực thực phẩm` → `năng lực thực tế`.
- Đổi `Lưu dấu vết nhận thức` → `Lưu dấu ấn tâm thức`.
- Đổi tiêu đề Settings thành `Cài đặt`.
- Loại ảnh avatar remote từ AI Studio, thay bằng avatar chữ để tránh phụ thuộc link ngoài.
- Cập nhật README tiếng Việt.
- Thêm `CODEX_PROMPT.md` để gửi thẳng cho Codex.

## Đã test

```bash
npm run lint
npm run build
```

Kết quả: build thành công.

## Điểm mạnh

- Giao diện đã khá đẹp, có mood rõ.
- Luồng sản phẩm có sẵn: viết → kiểm chứng → chốt → bản đồ.
- Component đã chia tương đối rõ.
- Có localStorage để lưu tạm dữ liệu.

## Điểm cần Codex làm tiếp

- Thêm custom hook cho localStorage.
- Thêm chức năng xem chi tiết từng dấu ấn đã lưu.
- Thêm reset dữ liệu trong Settings.
- Tinh chỉnh copywriting để đúng concept “nhật ký nâng cao nhận thức”.
- Kiểm tra mobile kỹ hơn.
- Sau MVP mới tính backend/MongoDB.
