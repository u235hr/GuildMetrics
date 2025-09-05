const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="react-bits-top-three"]', { timeout: 10000 });
  await page.waitForTimeout(2000);
  
  const container = await page.locator('[data-testid="react-bits-top-three"]');
  const containerBox = await container.boundingBox();
  
  const goldCard = await page.locator('[data-testid="react-bits-top-three"] > div > div:first-child');
  const goldBox = await goldCard.boundingBox();
  
  if (containerBox && goldBox) {
    const containerCenterX = containerBox.x + containerBox.width / 2;
    const containerCenterY = containerBox.y + containerBox.height / 2;
    const goldCenterX = goldBox.x + goldBox.width / 2;
    const goldCenterY = goldBox.y + goldBox.height / 2;
    const offsetX = goldCenterX - containerCenterX;
    const offsetY = goldCenterY - containerCenterY;
    
    console.log('=== 金卡中心与中轴线交点对齐检查 ===');
    console.log('容器中心点:', { x: containerCenterX, y: containerCenterY });
    console.log('金卡中心点:', { x: goldCenterX, y: goldCenterY });
    console.log('偏差像素:', { x: offsetX, y: offsetY });
    console.log('是否水平居中:', Math.abs(offsetX) < 2 ? ' 是' : ' 否');
    console.log('是否垂直居中:', Math.abs(offsetY) < 2 ? ' 是' : ' 否');
    console.log('总体居中:', (Math.abs(offsetX) < 2 && Math.abs(offsetY) < 2) ? ' 完美居中' : ' 需要调整');
  }
  
  await browser.close();
})();
