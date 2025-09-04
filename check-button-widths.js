import BrowserTool from './src/utils/BrowserTool.js';

async function checkButtonWidths() {
  const browser = new BrowserTool();
  try {
    console.log(' 检查按钮宽度一致性...');
    
    await browser.navigate('http://localhost:3000');
    await browser.waitFor('[data-testid="header"]', 5000);
    
    // 获取所有按钮的宽度信息
    const buttonInfo = await browser.evaluate(`
      Array.from(document.querySelectorAll('[data-testid="header"] nav button')).map((btn, index) => ({
        text: btn.textContent,
        width: btn.offsetWidth,
        height: btn.offsetHeight,
        classes: btn.className
      }))
    `);
    
    console.log(' 按钮信息:');
    buttonInfo.forEach((btn, index) => {
      console.log(`按钮 ${index + 1}: "${btn.text}" - 宽度: ${btn.width}px, 高度: ${btn.height}px`);
    });
    
    // 检查宽度是否一致
    const widths = buttonInfo.map(btn => btn.width);
    const allSameWidth = widths.every(width => width === widths[0]);
    
    if (allSameWidth) {
      console.log(' 所有按钮宽度一致！');
    } else {
      console.log(' 按钮宽度不一致！');
      console.log('宽度差异:', Math.max(...widths) - Math.min(...widths), 'px');
    }
    
  } catch (error) {
    console.error(' 检查失败:', error.message);
  } finally {
    await browser.close();
  }
}

checkButtonWidths();
