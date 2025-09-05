const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // 获取容器信息
  const container = await page.locator('[data-testid="react-bits-top-three"]');
  const containerBox = await container.boundingBox();
  
  // 获取金卡信息
  const goldCard = await page.locator('[data-testid="react-bits-top-three"] > div > div').first();
  const goldBox = await goldCard.boundingBox();
  
  // 获取金卡内部的头像区域（视觉中心应该在头像中心）
  const avatarSection = await page.locator('[data-testid="react-bits-top-three"] .pc-avatar-section');
  const avatarBox = await avatarSection.boundingBox();
  
  if (containerBox && goldBox && avatarBox) {
    // 计算容器中心点
    const containerCenterX = containerBox.x + containerBox.width / 2;
    const containerCenterY = containerBox.y + containerBox.height / 2;
    
    // 计算金卡几何中心点
    const goldCenterX = goldBox.x + goldBox.width / 2;
    const goldCenterY = goldBox.y + goldBox.height / 2;
    
    // 计算头像中心点（视觉中心）
    const avatarCenterX = avatarBox.x + avatarBox.width / 2;
    const avatarCenterY = avatarBox.y + avatarBox.height / 2;
    
    console.log('=== 金卡视觉中心分析 ===');
    console.log('容器中心点:', { x: containerCenterX, y: containerCenterY });
    console.log('金卡几何中心:', { x: goldCenterX, y: goldCenterY });
    console.log('金卡头像中心:', { x: avatarCenterX, y: avatarCenterY });
    
    const geoOffsetX = goldCenterX - containerCenterX;
    const geoOffsetY = goldCenterY - containerCenterY;
    const visualOffsetX = avatarCenterX - containerCenterX;
    const visualOffsetY = avatarCenterY - containerCenterY;
    
    console.log('几何中心偏差:', { x: geoOffsetX, y: geoOffsetY });
    console.log('视觉中心偏差:', { x: visualOffsetX, y: visualOffsetY });
  }
  
  await browser.close();
})();
