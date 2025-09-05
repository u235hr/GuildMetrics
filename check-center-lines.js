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
  
  // 获取中轴线信息
  const horizontalLine = await page.locator('.absolute.top-1\\/2.left-0.right-0.h-px.bg-black');
  const verticalLine = await page.locator('.absolute.left-1\\/2.top-0.bottom-0.w-px.bg-black');
  
  const hLineBox = await horizontalLine.boundingBox();
  const vLineBox = await verticalLine.boundingBox();
  
  console.log('=== 中轴线位置检查 ===');
  console.log('容器尺寸:', { width: containerBox.width, height: containerBox.height });
  console.log('容器中心点:', { x: containerBox.x + containerBox.width / 2, y: containerBox.y + containerBox.height / 2 });
  
  if (hLineBox) {
    console.log('横向中线位置:', { x: hLineBox.x, y: hLineBox.y, width: hLineBox.width, height: hLineBox.height });
    console.log('横向中线中心Y:', hLineBox.y + hLineBox.height / 2);
  }
  
  if (vLineBox) {
    console.log('纵向中线位置:', { x: vLineBox.x, y: vLineBox.y, width: vLineBox.width, height: vLineBox.height });
    console.log('纵向中线中心X:', vLineBox.x + vLineBox.width / 2);
  }
  
  await browser.close();
})();
