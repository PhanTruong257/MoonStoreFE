# CHECKLIST SỬA FILE WORD — Báo Cáo Đồ Án Tốt Nghiệp

> **File Word:** `C:\Users\truongpv\school\ĐATN\Báo Cáo Đồ Án Tốt Nghiệp.docx`
> **Nguồn nội dung đúng:** `d:\code\DATN\report\bao-cao-do-an.md`
> **Tạo lúc:** 2026-06-13 20:14
> **Cách dùng:** sửa xong mục nào, đổi `[ ]` → `[x]` và ghi ngày giờ vào cột "Đã sửa lúc" để tránh làm trùng.

---

## A. Sửa nhanh text sai (tìm & thay)

| # | Trạng thái | Đang sai | Sửa thành | Đã sửa lúc |
|---|-----------|----------|-----------|------------|
| A1 | [ ] | OpenAI API | Google Gemini | |
| A2 | [ ] | GPT-4o-mini | Gemini 2.5 | |
| A3 | [ ] | OpenAI Embeddings | mô hình embedding của Google | |
| A4 | [ ] | Tiêu đề mục 1.5.7 "OpenAI API" | Google Gemini API | |
| A5 | [ ] | FastAPI / ChromaDB / "thư viện Python" (Chương 3.1) | module NestJS, `@google/generative-ai`, vector lưu MySQL | |
| A6 | [ ] | Chroma/Pinecone/pgvector (mục 1.4.4) | lưu vector trong MySQL (`product_embeddings`) | |
| A7 | [ ] | "hỗ trợ đăng nhập Google OAuth" | bỏ cụm này (code không có) | |
| A8 | [ ] | "dịch vụ Python riêng để xử lý chatbot" (mục 1.2) | module chatbot AI nằm trong backend NestJS | |

---

## B. Đổi "3 role" → "4 role" (thêm Shipper)

Mọi chỗ ghi *"ba role / ba nhóm vai trò: User, Seller, Admin"* → **"bốn role: User, Seller, Shipper, Admin"**.

| # | Trạng thái | Vị trí | Đã sửa lúc |
|---|-----------|--------|------------|
| B1 | [ ] | Tóm tắt | |
| B2 | [ ] | Nhiệm vụ ĐATN | |
| B3 | [ ] | Mở đầu — Mục tiêu | |
| B4 | [ ] | Chương 1.1 | |
| B5 | [ ] | Chương 2.1 | |

---

## C. Thay mới hoàn toàn 3 mục (đang còn là của đề tài mẫu Voca English)

Copy đè từ file `.md`. Đây là lỗi nặng nhất.

| # | Trạng thái | Mục | Ghi chú | Đã sửa lúc |
|---|-----------|-----|---------|------------|
| C1 | [ ] | MỤC LỤC | Thay bằng mục lục Moon Store (3 chương) | |
| C2 | [ ] | DANH SÁCH HÌNH VẼ | 56 hình (KHÔNG phải wav2vec/phoneme/flashcard) | |
| C3 | [ ] | DANH SÁCH CÁC BẢNG | 24 bảng (KHÔNG phải Collection/Dictionary/fine-tuning) | |

---

## D. Bổ sung nội dung đang TRỐNG (chỉ có heading rỗng)

Copy từ `.md` sang.

### Chương 2 (từ 2.2.2 trở đi đang trống)

| # | Trạng thái | Mục | Đã sửa lúc |
|---|-----------|-----|------------|
| D1 | [ ] | 2.2.1 — Bảng 1 (chức năng 4 role) + Bảng 2 | |
| D2 | [ ] | 2.2.2 — Yêu cầu phi chức năng | |
| D3 | [ ] | 2.3.1 — Sơ đồ use case + 10 bảng đặc tả (Bảng 3–12) | |
| D4 | [ ] | 2.3.2 — Sơ đồ tuần tự (8 luồng) | |
| D5 | [ ] | 2.4.1 — Bảng 13 (công nghệ) | |
| D6 | [ ] | 2.4.2 — Kiến trúc hệ thống | |
| D7 | [ ] | 2.4.3 — Thiết kế CSDL (~25 bảng theo nhóm) | |
| D8 | [ ] | 2.4.4 — Bảng 14–21 (API) | |
| D9 | [ ] | 2.5 — Pipeline chatbot AI + Bảng 22 (gồm cả đoạn giải thích chọn Gemini thay OpenAI ở 2.5.1) | |

### Chương 3 (thiếu nhiều)

| # | Trạng thái | Mục | Đã sửa lúc |
|---|-----------|-----|------------|
| D10 | [ ] | 3.1.5 — Bảng 23 (kết quả chatbot) | |
| D11 | [ ] | 3.2.3 — Triển khai tổng thể (Docker 3 service) | |
| D12 | [ ] | 3.3 — Kết quả chạy (mô tả 22 màn hình) + Bảng 24 | |
| D13 | [ ] | 3.4 — Kết chương | |

### Cuối báo cáo (đang trống)

| # | Trạng thái | Mục | Đã sửa lúc |
|---|-----------|-----|------------|
| D14 | [ ] | Kết luận và hướng phát triển | |
| D15 | [ ] | Tài liệu tham khảo (10 mục) | |
| D16 | [ ] | Phụ lục A, B, C | |

---

## E. Xóa nội dung copy nhầm từ mẫu

| # | Trạng thái | Việc cần làm | Đã sửa lúc |
|---|-----------|--------------|------------|
| E1 | [ ] | Nhiệm vụ ĐATN: xóa dòng "Chương 4: Triển khai và đánh giá" (đề tài chỉ có 3 chương) | |

---

## Ghi chú thao tác

- Dán dạng **"Keep Text Only"** để không vỡ format, sau đó gắn lại Heading style của template trường.
- Các sơ đồ (use case Hình 15–20, tuần tự Hình 21–28, kiến trúc Hình 29, CSDL Hình 30, pipeline Hình 31) **chưa vẽ** — cần vẽ riêng rồi chèn vào đúng vị trí placeholder `(Hình X. ...)`.
- ✅ **Đã chốt:** báo cáo dùng **Google Gemini** (khớp code). Mục 2.5.1 đã thêm 1 đoạn giải thích việc chọn Gemini thay cho OpenAI (so với đề cương) — lý do: API dễ tiếp cận, chi phí phù hợp, hỗ trợ tốt tiếng Việt. Cập nhật đoạn này vào Word luôn (nằm trong mục D9).
