# FPTU Handbook RAG Mobile

Ứng dụng mobile tra cứu thông tin sinh viên FPT University sử dụng React Native, RAG (Retrieval-Augmented Generation), **Ant Design Mobile**, **màu cam và trắng**, và **font SVN-Product Sans**.

## Tính năng chính

### 1. Màn hình Đăng nhập
- Đăng nhập bằng Google OAuth
- Kiểm tra email sinh viên (@fpt.edu.vn)
- Xác thực qua hệ thống Academic Office

### 2. Màn hình Trang chủ
- Thanh "Hỏi AI" nổi bật (màu cam)
- Thông báo gần đây
- Lối tắt đến các tính năng chính

### 3. Màn hình Hỏi AI
- Chat interface với RAG system
- Hỗ trợ Tiếng Việt và Tiếng Anh
- Feedback buttons (👍/👎) cho mỗi câu trả lời
- Tích hợp API RAG

### 4. Màn hình Thư mục Câu lạc bộ
- Tìm kiếm CLB theo tên, loại hình
- Bộ lọc theo loại: Học thuật, Thể thao, Văn hóa, Xã hội
- Danh sách CLB dạng card

### 5. Màn hình Chi tiết Câu lạc bộ
- Thông tin đầy đủ về CLB
- Ban quản lý và nhiệm kỳ
- Thông tin liên hệ (Email, Fanpage)
- Sự kiện sắp diễn ra

### 6. Màn hình Thông báo
- Tất cả thông báo từ Academic Office, Student Affairs, và CLB
- Tabs lọc theo danh mục: Học vụ, Sự kiện, CLB
- Hiển thị thời gian đăng tải

### 7. Màn hình Cá nhân & Cài đặt
- Thông tin cá nhân (MSSV, Email)
- Cài đặt ngôn ngữ (Tiếng Việt/Tiếng Anh)
- Trợ giúp và báo lỗi
- Đăng xuất

## Design System

### Màu sắc
- **Primary Orange**: `#FF6B35` - Màu cam chính
- **White**: `#FFFFFF` - Màu trắng
- **Background Secondary**: `#FFF8F3` - Nền cam nhạt
- Xem thêm trong `src/theme/index.ts`

### Font
- **SVN-Product Sans** - Font chính
  - Regular: `SVN-Product Sans`
  - Medium: `SVN-Product Sans Medium`
  - Bold: `SVN-Product Sans Bold`
- Xem hướng dẫn setup font trong `FONT_SETUP.md`

### UI Framework
- **Ant Design Mobile RN** (`@ant-design/react-native`)
- Components: Button, WingBlank, WhiteSpace, và nhiều components khác

## Yêu cầu hệ thống

- Node.js >= 18
- npm hoặc yarn
- React Native CLI
- Android Studio (cho Android)
- Xcode (cho iOS - chỉ trên macOS)
- Google Cloud Console account (cho Google OAuth)

## Cài đặt

### 1. Clone repository và cài đặt dependencies

```bash
npm install
```

hoặc

```bash
yarn install
```

### 2. Cấu hình Font SVN-Product Sans

1. Tải font SVN-Product Sans và đặt vào `assets/fonts/`
2. Xem chi tiết trong `FONT_SETUP.md`

```bash
# Sau khi thêm font files, chạy:
npx react-native-asset
```

### 3. Cấu hình Google OAuth

1. Tạo project trên [Google Cloud Console](https://console.cloud.google.com/)
2. Bật Google Sign-In API
3. Tạo OAuth 2.0 Client ID cho Android và iOS
4. Cập nhật `webClientId` trong `src/contexts/AuthContext.tsx`

Xem chi tiết trong file `GOOGLE_OAUTH_SETUP.md`

### 4. Cài đặt dependencies cho iOS (chỉ trên macOS)

```bash
cd ios && pod install && cd ..
```

### 5. Chạy ứng dụng

#### Metro Bundler
```bash
npm start
```

#### Android (terminal mới)
```bash
npm run android
```

#### iOS (chỉ trên macOS)
```bash
npm run ios
```

## Cấu trúc dự án

```
├── android/              # Native Android code
├── ios/                  # Native iOS code
├── assets/
│   └── fonts/           # SVN-Product Sans font files
├── src/
│   ├── components/       # Reusable components
│   ├── contexts/         # React Context (Auth)
│   ├── i18n/            # Internationalization (i18n)
│   │   └── locales/      # Translation files (en.json, vi.json)
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Screen components
│   ├── theme/           # Theme colors và fonts
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions và constants
├── App.tsx               # Main App component
├── index.js              # Entry point
└── package.json          # Dependencies
```

## Scripts

- `npm start` - Khởi động Metro Bundler
- `npm run android` - Chạy ứng dụng trên Android
- `npm run ios` - Chạy ứng dụng trên iOS
- `npm test` - Chạy tests
- `npm run lint` - Kiểm tra code với ESLint

## Dependencies chính

- **React Native 0.73.0** - Framework chính
- **@ant-design/react-native** - Ant Design Mobile components
- **React Navigation** - Điều hướng trong app (Stack & Bottom Tabs)
- **@react-native-google-signin/google-signin** - Google OAuth
- **i18next & react-i18next** - Đa ngôn ngữ (Vi/En)
- **AsyncStorage** - Lưu trữ dữ liệu local
- **TypeScript** - Type safety

## Phát triển

1. Clone repository
2. Cài đặt dependencies: `npm install`
3. Cấu hình font (xem `FONT_SETUP.md`)
4. Cấu hình Google OAuth (xem `GOOGLE_OAUTH_SETUP.md`)
5. Chạy Metro Bundler: `npm start`
6. Mở terminal khác và chạy: `npm run android` hoặc `npm run ios`

## API Integration

### RAG API
Cần tích hợp API RAG trong file `src/screens/AIQAScreen.tsx`:
- Replace mock response với actual API call
- Implement error handling

### Student Verification API
Cần tích hợp API kiểm tra email sinh viên trong `src/contexts/AuthContext.tsx`:
- Replace `checkStudentEmail` function với actual API call

## Troubleshooting

### Font không hiển thị

1. Kiểm tra font files đã được đặt trong `assets/fonts/`
2. Chạy `npx react-native-asset`
3. Rebuild app: `npm run android` hoặc `npm run ios`
4. Xem thêm trong `FONT_SETUP.md`

### Android

Nếu gặp lỗi với Android SDK:
- Đảm bảo Android Studio đã được cài đặt
- Kiểm tra ANDROID_HOME environment variable
- Cài đặt Android SDK platform 33

### iOS

Nếu gặp lỗi với CocoaPods:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Google Sign-In

Nếu gặp lỗi với Google Sign-In:
- Kiểm tra SHA-1/SHA-256 đã được cấu hình đúng trong Google Cloud Console
- Đảm bảo OAuth Client ID đã được tạo cho Android và iOS
- Kiểm tra `webClientId` trong `AuthContext.tsx`

## License

MIT

## Liên hệ

FPT University