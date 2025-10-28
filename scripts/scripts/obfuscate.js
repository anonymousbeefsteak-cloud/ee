const Terser = require('terser');
const fs = require('fs');
const path = require('path');

// 混淆JavaScript代码
const obfuscateJS = async () => {
  try {
    const srcDir = path.join(__dirname, '../public');
    const destDir = path.join(__dirname, '../dist');
    
    // 确保dist目录存在
    if (!fs.existsSync(destDir)) {
      fs.mk.mkdirSync(destDir);
    }
    
    // 处理index.html中的script标签
    const htmlPath = path.join(srcDir, 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // 提取script标签内容
    const scriptRegex = /<script type="text\/babel">([\s\S]*?)<\/script>/g;
    const scripts = [];
    
    htmlContent = htmlContent.replace(scriptRegex, (match, content, index) => {
      scripts.push({ index, content });
      return `<script type="text/babel" id="script-${index}"></script>`;
    });
    
    // 混淆每个script内容
    for (const script of scripts) {
      const result = await Terser.minify(script.content, {
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        mangle: {
          toplevel: true,
          properties: {
            regex: /^_/
          }
        },
        output: {
          comments: false
        }
      });
      
      if (result.error) {
        console.error('JavaScript混淆错误:', result.error);
        continue;
      }
      
      // 将混淆后的代码放回HTML
      htmlContent = htmlContent.replace(
        `<script type="text/babel" id="script-${script.index}"></script>`,
        `<script type="text/babel">${result.code}</script>`
      );
    }
    
    // 保存混淆后的HTML
    fs.writeFileSync(path.join(destDir, 'index.html'), htmlContent, 'utf8');
    console.log('HTML文件混淆完成');
    
    // 复制其他静态资源
    const assetsDir = path.join(srcDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      const destAssetsDir = path.join(destDir, 'assets');
      if (!fs.existsSync(destAssetsDir)) {
        fs.mkdirSync(destAssetsDir);
      }
      
      const assets = fs.readdirSync(assetsDir);
      for (const asset of assets) {
        const srcAssetPath = path.join(assetsDir, asset);
        const destAssetPath = path.join(destAssetsDir, asset);
        fs.copyFileSync(srcAssetPath, destAssetPath);
      }
      console.log('静态资源复制完成');
    }
    
    console.log('代码混淆完成');
  } catch (error) {
    console.error('代码混淆失败:', error);
    process.exit(1);
  }
};

// 执行混淆
obfuscateJS();
