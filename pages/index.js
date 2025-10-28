import { useState, useEffect } from 'react';
import Head from 'next/head';

// 配置 - 使用环境变量
const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const DELIVERY_FEE = 30;

// 默认菜单
const DEFAULT_MENU = [
  { name: '滷肉飯', price: 35, icon: '🍚', status: '供應中', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop' },
  { name: '雞肉飯', price: 40, icon: '🍗', status: '供應中', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop' },
  { name: '蚵仔煎', price: 65, icon: '🍳', status: '供應中', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop' },
  { name: '大腸麵線', price: 50, icon: '🍜', status: '供應中', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' },
  { name: '珍珠奶茶', price: 45, icon: '🥤', status: '供應中', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop' }
];

export default function Home() {
  const [config, setConfig] = useState({
    liffId: LIFF_ID,
    apiEndpoint: API_ENDPOINT
  });
  
  const [view, setView] = useState('order');
  const [notification, setNotification] = useState({ message: '', type: 'success', visible: false });

  // 检查环境变量
  useEffect(() => {
    if (!LIFF_ID || LIFF_ID === 'undefined') {
      setNotification({
        message: '⚠️ LIFF_ID 未正确设置，请检查环境变量配置',
        type: 'error',
        visible: true
      });
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  return (
    <div>
      <Head>
        <title>台灣小吃店 - LINE 快速訂餐</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
      </Head>

      {/* 显示配置信息 */}
      {!LIFF_ID && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center z-50">
          <p>❌ LIFF_ID 未设置: {LIFF_ID}</p>
          <p className="text-sm">请在 Vercel 环境变量中设置 NEXT_PUBLIC_LIFF_ID</p>
        </div>
      )}

      <div className="p-4 min-h-screen flex items-center justify-center">
        <div className="container max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#fff3cd] border border-[#ffeaa7] rounded-t-2xl p-2.5 text-xs text-center text-[#856404]">
            <span role="img" aria-label="lock">🔒</span> 安全訂餐系統 - 24小時接受預訂
          </div>

          <header className="bg-green-500 text-white p-5 text-center relative">
            <h1 className="text-2xl font-bold mb-1">🍜 台灣小吃店</h1>
            <p className="text-sm opacity-90">LINE 快速訂餐 - 24小時服務</p>
            <p className="text-xs mt-2">LIFF ID: {LIFF_ID ? '✅ 已设置' : '❌ 未设置'}</p>
          </header>

          <main className="p-5 space-y-4">
            {notification.visible && (
              <div className={`p-3 rounded-lg text-center ${
                notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {notification.message}
              </div>
            )}
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">系统状态</h2>
              <div className="mt-4 space-y-2 text-left">
                <p><strong>LIFF ID:</strong> {LIFF_ID ? '✅ 已配置' : '❌ 未配置'}</p>
                <p><strong>API 端点:</strong> {API_ENDPOINT ? '✅ 已配置' : '❌ 未配置'}</p>
              </div>
              
              {!LIFF_ID && (
                <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                  <h3 className="font-bold text-yellow-800">配置说明</h3>
                  <p className="text-sm text-yellow-700 mt-2">
                    1. 前往 Vercel 项目设置<br/>
                    2. 进入 Environment Variables<br/>
                    3. 添加: NEXT_PUBLIC_LIFF_ID = 2008316489-6nMjb0KX<br/>
                    4. 重新部署项目
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
