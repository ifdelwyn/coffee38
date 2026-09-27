# ☕ HBcoffee - Tiệm Cà Phê Vỉa Hè Sài Gòn

Game mô phỏng kinh doanh & pha chế cà phê vỉa hè Sài Gòn phong cách Anime Hoài Niệm Lo-Fi.

## 🚀 Tính Năng Chính
- **Menu 48 món đồ uống** đa dạng phong phú chuẩn công thức (Cà phê phin, Cà phê đặc sản, Trà trái cây, Trà sữa, Đá xay...).
- **24 sự cố vỉa hè hài hước & kịch tính** (Trật tự đô thị, Coder xóa DB, Cô Hà tìm mèo, Nhạc acoustic, Khách Tây...).
- **Hệ thống đánh giá sao thời gian thực**: Khách đợi 1p15s, tính kiên nhẫn bằng vòng tròn, phục vụ chuẩn nhận 4.2 - 5 sao. Phạt 300k nếu dưới 1.5 sao.
- **Vốn vay kinh doanh chuẩn Vietcombank**:
  - 🏛 Ngân Hàng (Vietcombank): Lãi suất VCB + 0.05% = 4.85%/ngày.
  - 🤝 Cá Nhân (Tư nhân vỉa hè): Lãi suất VCB + 1.25% = 6.05%/ngày.
- **Tiến trình riêng cho từng người chơi**: Hệ thống quản lý nhiều Client ID độc lập không đè dữ liệu.
- **Giao diện Responsive tràn viền 100%**: Tương thích hoàn hảo mọi kích thước màn hình Mobile, Tablet, Laptop và PC.

## 📱 Cài Đặt Trên iPhone (iOS)

### Cách 1: Cài đặt trực tiếp qua Safari (Khuyên dùng - Chuẩn PWA)
1. Mở website game trên **Safari** (iPhone / iPad).
2. Nhấn nút **Chia sẻ** (biểu tượng mũi tên đi lên ở thanh công cụ Safari).
3. Chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
4. Game sẽ xuất hiện như một ứng dụng độc lập trên màn hình chính, mở lên toàn màn hình không có thanh địa chỉ!

### Cách 2: Cài file HBcoffee.ipa
File gói cài đặt `HBcoffee.ipa` có sẵn trong thư mục dự án hoặc tải từ GitHub Releases:
- Sử dụng **TrollStore**, **Sideloadly**, **AltStore** hoặc **Scarlet** để ký chứng chỉ và cài đặt trực tiếp vào iPhone.

## 🌐 Deploy Lên Web

### Deploy lên GitHub Pages
```bash
git remote add origin https://github.com/<username>/<repo-name>.git
git branch -M main
git push -u origin main
```
Hệ thống GitHub Actions sẽ tự động deploy game lên `https://<username>.github.io/<repo-name>/`.

### Deploy lên Vercel
1. Truy cập [vercel.com](https://vercel.com).
2. Import repository GitHub và bấm **Deploy**.
