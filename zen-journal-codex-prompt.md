# Prompt gửi cho Codex

Bạn là senior frontend engineer kiêm product-minded UI engineer.

Tôi có một app React + TypeScript + Vite được export từ Google Stitch / Google AI Studio. App tên là **Zen Journal** — một ứng dụng nhật ký nâng cao nhận thức, giúp người dùng đi qua luồng:

1. Viết tự do suy nghĩ đang rối.
2. Kiểm chứng suy nghĩ bằng dữ kiện khách quan.
3. Phân biệt thực tế và diễn giải của tâm trí.
4. Chốt lại nhận thức mới.
5. Lưu thành “dấu ấn tâm thức”.
6. Xem lại trong bản đồ nhận thức.

Nhiệm vụ của bạn: đọc toàn bộ source code hiện tại và hoàn thiện app ở mức MVP chạy ổn trên local.

## Yêu cầu bắt buộc

- Giữ stack hiện tại: React + TypeScript + Vite + Tailwind CSS.
- Không chuyển sang Next.js ở bước đầu nếu chưa cần.
- Giữ visual gần bản Stitch gốc nhất có thể.
- Không thêm backend.
- Không thêm AI API ở bước này.
- Dữ liệu tiếp tục lưu bằng localStorage.
- Code phải chạy được bằng `npm run dev`.
- `npm run lint` và `npm run build` phải không lỗi.

## Việc cần làm

1. Đọc `src/App.tsx`, `src/types.ts`, toàn bộ file trong `src/components`.
2. Làm sạch code nhưng không phá giao diện.
3. Chuẩn hóa naming, props và type.
4. Tách bớt logic localStorage ra custom hook nếu thấy phù hợp.
5. Kiểm tra responsive desktop/mobile.
6. Kiểm tra các nút chuyển màn hình:
   - Hôm nay
   - Nhìn lại / Kiểm chứng
   - Chốt nhận thức
   - Bản đồ nhận thức
   - Cài đặt
7. Sửa mọi text còn lệch với concept:
   - Ưu tiên “Kiểm chứng” thay vì “kiểm tra niềm tin”.
   - Ưu tiên “dấu ấn tâm thức” thay vì “dấu vết nhận thức”.
   - Giọng văn đời thường, rõ, ấm, không quá thiền sư.
8. Thêm chức năng xem chi tiết một dấu ấn đã lưu nếu làm được nhanh.
9. Thêm nút reset dữ liệu localStorage trong Settings.
10. Cập nhật README nếu có thay đổi.

## Không được làm

- Không tự ý thêm đăng nhập.
- Không tự ý thêm database.
- Không tự ý thêm Gemini/OpenAI API.
- Không đổi toàn bộ style sang kiểu SaaS lạnh.
- Không xóa luồng kiểm chứng hiện tại.

## Lệnh cần chạy sau khi sửa

```bash
npm install
npm run lint
npm run build
npm run dev
```

Nếu có lỗi, hãy tự sửa cho đến khi build thành công.

## Output mong muốn

Sau khi hoàn thành, hãy báo lại:

1. Đã sửa những file nào.
2. App hiện có những màn hình nào.
3. Cách chạy local.
4. Việc nào nên làm ở phiên tiếp theo.
