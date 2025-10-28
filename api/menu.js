// 菜单API路由
module.exports = async (req, res) => {
  try {
    // 转发请求到Google Script
    const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Secret': process.env.API_SECRET
      },
      body: JSON.stringify({ action: 'getMenu' })
    });
    
    const data = await response.json();
    
    // 添加CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('API Error:', error);
    
    // 返回默认菜单
    const defaultMenu = [
      { name: '滷肉飯', price: 35, icon: '🍚', status: '供應中' },
      { name: '雞肉飯', price: 40, icon: '🍗', status: '供應中' },
      { name: '蚵仔煎', price: 65, icon: '🍳', status: '供應中' },
      { name: '大腸麵線', price: 50, icon: '🍜', status: '供應中' },
      { name: '珍珠奶茶', price: 45, icon: '🥤', status: '供應中' }
    ];
    
    return res.status(200).json({ success: true, data: defaultMenu });
  }
};
