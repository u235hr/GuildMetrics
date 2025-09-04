import BrowserTool from './src/utils/BrowserTool.js';

async function debugTopThree() {
  const browser = new BrowserTool();
  try {
    console.log(' 调试 Top3 卡片...');
    
    await browser.navigate('http://localhost:3000');
    await browser.waitFor('[data-testid="top-three"]', 5000);
    
    // 获取所有卡片的详细信息
    const cardInfo = await browser.evaluate(`
      Array.from(document.querySelectorAll('[data-testid^="top-card-"]')).map(card => {
        const rect = card.getBoundingClientRect();
        const rank = card.getAttribute('data-testid').split('-')[2];
        const text = card.querySelector('h3')?.textContent || '';
        const classes = card.className;
        return {
          rank: parseInt(rank),
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          text: text,
          hasH48: classes.includes('h-48'),
          hasH40: classes.includes('h-40'),
          hasH32: classes.includes('h-32')
        };
      }).sort((a, b) => a.left - b.left)
    `);
    
    console.log(' 详细卡片信息:');
    cardInfo.forEach((card, index) => {
      const position = ['左边', '中间', '右边'][index];
      console.log(`${position}: 排名${card.rank} - 高度: ${card.height}px, 文本: "${card.text}"`);
      console.log(`  CSS类: h-48:${card.hasH48}, h-40:${card.hasH40}, h-32:${card.hasH32}`);
    });
    
  } catch (error) {
    console.error(' 调试失败:', error.message);
  } finally {
    await browser.close();
  }
}

debugTopThree();
