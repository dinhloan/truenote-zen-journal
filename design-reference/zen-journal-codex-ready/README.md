# Zen Journal — Stitch / AI Studio Export

Đây là source code được xuất từ Google Stitch qua Google AI Studio, đã được làm sạch nhẹ để có thể mở trong VS Code và đưa tiếp cho Codex chỉnh sửa.

## Công nghệ hiện tại

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- lucide-react icons
- Lưu dữ liệu tạm bằng `localStorage`

## Chạy trên máy bằng VS Code

### 1. Giải nén file zip

Giải nén thư mục này vào máy, ví dụ:

```bash
D:\Create Web\zen-journal
```

### 2. Mở bằng VS Code

Trong VS Code chọn:

```text
File → Open Folder → chọn thư mục zen-journal
```

### 3. Mở Terminal trong VS Code

```text
Terminal → New Terminal
```

### 4. Cài thư viện

```bash
npm install
```

### 5. Chạy app

```bash
npm run dev
```

Sau đó mở trình duyệt theo link Vite hiện ra, thường là:

```text
http://localhost:3000
```

## Kiểm tra lỗi

```bash
npm run lint
npm run build
```

Bản này đã được kiểm tra bằng:

```bash
npm run lint
npm run build
```

và build thành công.

## Cấu trúc thư mục chính

```text
src/
  App.tsx                     # Shell chính, quản lý màn hình và localStorage
  main.tsx                    # Entry point
  index.css                   # Theme, Tailwind, font, màu
  types.ts                    # TypeScript types
  components/
    Sidebar.tsx               # Menu trái
    TodayScreen.tsx           # Màn hình viết nhật ký thô
    VerificationScreen.tsx    # Màn hình kiểm chứng suy nghĩ / niềm tin
    IntegrationScreen.tsx     # Màn hình chốt nhận thức
    MapScreen.tsx             # Bản đồ nhận thức / lịch sử
    SettingsScreen.tsx        # Cài đặt giao diện
    ZenBackground.tsx         # Nền động WebGL
```

## Ghi chú kỹ thuật

- App hiện chưa có backend.
- Dữ liệu được lưu trong `localStorage` với key `zen_journal_state_v1`.
- Không cần Gemini API ở bản hiện tại.
- Có thể đưa nguyên thư mục này cho Codex để refactor hoặc nâng cấp thành Next.js.

## Hướng nâng cấp đề xuất

1. Chuẩn hóa UX flow: Viết → Kiểm chứng → Chốt → Lưu dấu ấn tâm thức.
2. Thêm màn hình xem lại từng dấu ấn đã lưu.
3. Thêm chức năng xuất dữ liệu Markdown.
4. Thêm backend MongoDB nếu muốn đồng bộ nhiều thiết bị.
5. Sau khi MVP ổn, có thể chuyển sang Next.js App Router.
