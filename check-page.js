const { chromium } = require('playwright');

async function checkPage() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('访问页面...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 检查页面标题
    const title = await page.title();
    console.log('页面标题:', title);
    
    // 检查是否有错误
    const errorText = await page.locator('text=Error').count();
    console.log('错误数量:', errorText);
    
    // 检查容器
    const container = await page.locator('[data-testid="react-bits-top-three"]').count();
    console.log('容器数量:', container);
    
    // 检查所有卡片
    const allCards = await page.locator('.pc-card-wrapper').count();
    console.log('所有卡片数量:', allCards);
    
    // 检查页面内容
    const bodyText = await page.locator('body').textContent();
    console.log('页面内容长度:', bodyText ? bodyText.length : 0);
    
    // 截图
    await page.screenshot({ path: 'page-check.png' });
    console.log('截图已保存');
    
  } catch (error) {
    console.error('检查出错:', error);
  } finally {
    await browser.close();
  }
}

checkPage();
