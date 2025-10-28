# 台灣小吃店 LINE 訂餐系統 - 安全加固版

這是一個基於 LINE LIFF 的台灣小吃店訂餐系統，具備完整的安全加固措施，防止 API 信息洩露和程式碼複製。

## 安全特性

### 🔒 核心安全功能

1. **API 端點隱藏**
   - 使用 Vercel API 路由轉發請求
   - Google Script URL 完全隱藏在伺服器端
   - 客戶端無法直接接觎後端 API

2. **請求驗證機制**
   - 基於時間戳和 HMAC 的請求簽名驗證
   - LIFF ID Token 驗證
   - 速率限制保護護止濫用

3. **程式碼保護**
   - 自動化程式碼混淆
   - 敏感資訊環境變數化
   - 最小化和壓縮前端程式碼

4. **防機器人機制**
   - reCAPTCHA 驗證整合
   - 請求頻率限制
   - 異常行為檢測

## 一鍵部署

### 使用 GitHub Template 部署

1. 點擊 [Use this template](https://github.com/yourusername/taiwan-food-order-system/generate) 按鈕創建新倉庫
2. 在 Vercel 中導入新創建的倉庫
3. 配置必要的環境變數
4. 自動部署流程將開始執行

### 手動部署步驟

```bash
# 克隆倉庫
git clone https://github.com/yourusername/taiwan-food-order-system.git
cd taiwan-food-order-system

# 安裝依賴
npm install

# 本地開發
npm run dev

# 構建生產版本
npm run build
npm run obfuscate

# 部署到 Vercel
npm run deploy
```

## 環境變數配置

在 Vercel 專案設定中配置以下環境變數：

### 🔑 LINE 相關
- `LIFF_ID`: 你的 LINE LIFF 應用程式 ID
- `LIFF_CHANNEL_SECRET`: LINE 頻道密鑰 (用於伺服器端驗證)

### 🔗 Google Script 相關
- `GOOGLE_SCRIPT_URL`: Google Apps Script Web App URL
- `GOOGLE_SCRIPT_SECRET`: Google Script 驗證密鑰

### 🔐 安全相關
- `API_SECRET`: API 請求簽名驗證密鑰
- `RECAPTCHA_SITE_KEY`: reCAPTCHA 網站金鑰
- `RECAPTCHA_SECRET_KEY`: reCAPTCHA 秘密金鑰

### 🌐 應用設定
- `NEXT_PUBLIC_API_URL`: API 基礎 URL (預設: `/api`)
- `NODE_ENV`: 環境類型 (production/development)

## 專案結構

```
/
├── .github/workflows/       # GitHub Actions 工作流程
├── api/                     # Vercel API 路由
│   ├── order.js             # 訂單處理 API
│   └── menu.js              # 菜單獲取 API
├── public/                  # 前端資源
│   ├── index.html           # 主頁面模板
│   └── assets/              # 靜態資源
├── scripts/                 # 構建腳本
│   ├── build.js             # 構建腳本
│   └── obfuscate.js         # 程式碼混淆腳本
├── vercel.json              # Vercel 配置
├── package.json             # 專案依賴
└── README.md                # 專案說明
```

## 安全最佳實踐

1. **環境變數管理**
   - 所有敏感資訊必須存儲在環境變數中
   - 定期輪換 API_SECRET 和其他安全金鑰
   - 限制環境變數的訪問權限

2. **部署安全**
   - 啟用 HTTPS 加密
   - 配置適當的 CORS 政策
   - 實施內容安全策略 (CSP)

3. **程式碼安全**
   - 定期更新依賴包
   - 執行安全掃描
   - 避免在前端程式碼中暴露敏感資訊

## 故障排除

### 常見問題

1. **LIFF 初始化失敗**
   - 檢查 LIFF_ID 是否正確配置
   - 確認 LINE 開發者控制台中的設定
   - 檢查網路連接

2. **API 請求失敗**
   - 檢查環境變數配置
   - 查看 Vercel 日誌
   - 驗證 Google Script URL 是否可訪問

3. **程式碼混淆錯誤**
   - 檢查 JavaScript 語法錯誤
   - 更新 Terser 版本
   - 查看詳細的錯誤日誌

## 維護與更新

1. **定期更新**
   - 保持依賴包最新
   - 定期檢查安全漏洞
   - 更新 LINE LIFF SDK

2. **監控**
   - 設置錯誤跟蹤
   - 監控 API 使用情況
   - 跟蹤訂單處理流程

## 授權

MIT License
