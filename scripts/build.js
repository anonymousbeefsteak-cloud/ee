const fs = require('fs');
const path = require('path');

// 读取环境变量到HTML文件
const buildHTML = () => {
  try {
    const srcPath = path.join(__dirname, '../public/index.html');
    const destPath = path.join(__dirname, '../dist/index.html');
    
    // 读取环境变量
    const env = {
      API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
      API_SECRET: process.env.API_SECRET || 'default_secret',
      LIFF_ID: process.env.LIFF_ID || 'default_liff_id'
    };
    
    // 读取源文件
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // 替换模板变量
    content = content.replace(/<%= API_URL %>/g, env.API_URL)
                   .replace(/<%= API_SECRET %>/g, env.API_SECRET)
                   .replace(/<%= LIFF_ID %>/g, env.LIFF_ID);
    
    // 创建dist目录
    if (!fs.existsSync(path.join(__dirname, '../dist'))) {
      fs.mkdirSync(path.join(__dirname, '../dist'));
    }
    
    // 写入目标文件
    fs.writeFileSync(destPath, content, 'utf8');
    console.log('HTML文件构建完成');
  } catch (error) {
    console.error('HTML文件构建失败:', error);
    process.exit(1);
  }
};

// 执行构建
buildHTML();
