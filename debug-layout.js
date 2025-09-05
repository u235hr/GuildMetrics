const { chromium } = require('playwright');

async function debugLayout() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('访问页面...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 检查页面内容
    const title = await page.title();
    console.log('页面标题:', title);
    
    // 检查是否有错误
    const errors = await page.locator('text=Error').count();
    console.log('错误数量:', errors);
    
    // 检查容器是否存在
    const container = await page.locator('[data-testid="react-bits-top-three"]').count();
    console.log('容器数量:', container);
    
    // 检查所有卡片
    const allCards = await page.locator('.pc-card-wrapper').count();
    console.log('所有卡片数量:', allCards);
    
    // 检查前三名容器内的元素
    const containerChildren = await page.locator('[data-testid="react-bits-top-three"] > div > div').count();
    console.log('容器内子元素数量:', containerChildren);
    
    // 截图
    await page.screenshot({ path: 'debug-layout.png' });
    console.log('截图已保存: debug-layout.png');
    
  } catch (error) {
    console.error('调试出错:', error);
  } finally {
    await browser.close();
  }
}

debugLayout();
