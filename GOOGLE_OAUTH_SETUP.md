# Hướng dẫn Setup Google OAuth

## Bước 1: Tạo Project trên Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Kích hoạt **Google Sign-In API**

## Bước 2: Tạo OAuth 2.0 Client ID

### Cho Android:

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Chọn **Application type**: Android
4. Nhập **Package name**: (xem trong `android/app/build.gradle`)
5. Nhập **SHA-1 certificate fingerprint**:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
6. Copy **Web client ID** (cần thiết cho cấu hình)

### Cho iOS:

1. Tạo **OAuth client ID** mới cho iOS
2. Chọn **Application type**: iOS
3. Nhập **Bundle ID**: (xem trong `ios/YourApp/Info.plist`)
4. Copy **Client ID**

## Bước 3: Cấu hình trong ứng dụng

### Android (`android/app/build.gradle`)

Thêm vào `defaultConfig`:
```gradle
resValue "string", "google_client_id", "YOUR_WEB_CLIENT_ID_HERE"
```

### iOS (`ios/YourApp/Info.plist`)

Thêm Google Sign-In URL scheme:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
    </array>
  </dict>
</array>
```

### Cập nhật `src/contexts/AuthContext.tsx`

Thay thế `YOUR_WEB_CLIENT_ID` bằng Web Client ID từ Google Cloud Console:

```typescript
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
  iosClientId: 'YOUR_IOS_CLIENT_ID_HERE', // Chỉ cho iOS
});
```

## Bước 4: Kiểm tra cấu hình

1. Rebuild ứng dụng sau khi cập nhật cấu hình
2. Test đăng nhập bằng Google
3. Kiểm tra email đăng nhập có trong danh sách sinh viên

## Lưu ý

- **Web Client ID** là cần thiết cho cả Android và iOS
- **SHA-1** cho Android phải khớp với Google Cloud Console
- **Bundle ID** cho iOS phải khớp với Google Cloud Console
- Trong môi trường production, sử dụng release keystore SHA-1

## Troubleshooting

### Lỗi: "DEVELOPER_ERROR"

- Kiểm tra SHA-1 đã được thêm đúng trong Google Cloud Console
- Rebuild ứng dụng sau khi cập nhật SHA-1

### Lỗi: "Sign in cancelled"

- Kiểm tra `webClientId` đã được cấu hình đúng
- Kiểm tra Google Play Services đã được cài đặt trên thiết bị

### Lỗi: "Network error"

- Kiểm tra kết nối internet
- Kiểm tra Google Sign-In API đã được kích hoạt
