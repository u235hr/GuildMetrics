import BrowserTool from './src/utils/BrowserTool.js';

async function checkHeader() {
  const browser = new BrowserTool();
  try {
    console.log(' 检查 Header 文本显示...');
    
    await browser.navigate('http://localhost:3000');
    await browser.waitFor('[data-testid="header"]', 5000);
    
    const headerText = await browser.getText('[data-testid="header"] h1');
    const subtitleText = await browser.getText('[data-testid="header"] p');
    
    console.log(' Header 标题:', headerText);
    console.log(' Header 副标题:', subtitleText);
    
    const navTexts = await browser.evaluate(`
      Array.from(document.querySelectorAll('[data-testid="header"] nav button')).map(btn => btn.textContent)
    `);
    console.log(' 导航按钮:', navTexts);
    
    // 检查是否有乱码
    if (headerText.includes('') || subtitleText.includes('')) {
      console.log(' 发现乱码字符！');
    } else {
      console.log(' 文本显示正常，无乱码');
    }
    
  } catch (error) {
    console.error(' 检查失败:', error.message);
  } finally {
    await browser.close();
  }
}

checkHeader();
