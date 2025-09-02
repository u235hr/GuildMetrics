// 验证前三名卡片样式的测试脚本
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function verifyTopThreeStyles() {
  console.log('🚀 启动浏览器验证前三名卡片样式...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    
    // 导航到应用页面
    console.log('📱 正在加载页面...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // 等待前三名组件加载
    console.log('⏳ 等待前三名组件加载...');
    await page.waitForSelector('.top-three-section', { timeout: 10000 });
    
    // 检查关键元素是否存在
    console.log('🔍 检查关键样式元素...');
    
    const checks = {
      topThreeSection: await page.$('.top-three-section'),
      rankingBadges: await page.$$('[class*="absolute -top-2 -right-2"]'),
      decorativeCircles: await page.$$('[class*="absolute -top-1 -right-1"], [class*="absolute -bottom-1 -left-1"]'),
      championStar: await page.$('[class*="animate-pulse"]'),
      championCrown: await page.$('[class*="absolute -top-1 -right-1 w-3 h-3"]'),
      gradientBadges: await page.$$('[class*="bg-gradient-to-r"]'),
      scaledCards: await page.$$('[class*="scale-110"], [class*="scale-100"]')
    };

    // 调试：打印可能的皇冠候选元素 class 列表
    const debugCandidates = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('[class*="-top-1"][class*="-right-1"]'));
      const simple = nodes.map(n => n.getAttribute('class'));
      const w3h3 = Array.from(document.querySelectorAll('[class*="w-3"][class*="h-3"]')).map(n => n.getAttribute('class'));
      const exact = document.querySelector('[class*="absolute -top-1 -right-1 w-3 h-3"]');
      return { candidates: simple, w3h3, exact: exact ? exact.getAttribute('class') : null };
    });
    
    // 截图保存
    console.log('📸 正在截图...');
    const screenshotPath = path.join(__dirname, 'top-three-verification.png');
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 800 }
    });
    
    // 验证结果
    const results = {
      '前三名区域': !!checks.topThreeSection,
      '排名徽章数量': checks.rankingBadges.length,
      '装饰圆圈数量': checks.decorativeCircles.length,
      '冠军闪烁星星': !!checks.championStar,
      '冠军小皇冠': !!checks.championCrown,
      '渐变徽章数量': checks.gradientBadges.length,
      '缩放卡片数量': checks.scaledCards.length
    };
    
    console.log('\n✅ 验证结果:');
    Object.entries(results).forEach(([key, value]) => {
      const status = typeof value === 'boolean' ? (value ? '✓' : '✗') : value;
      console.log(`   ${key}: ${status}`);
    });

    console.log('\n🧪 调试: 可能的皇冠候选元素（含 -top-1 -right-1）数量:', debugCandidates.candidates.length);
    debugCandidates.candidates.slice(0, 10).forEach((cls, idx) => console.log(`   candidate[${idx}]:`, cls));
    console.log('🧪 调试: w-3 h-3 元素数量:', debugCandidates.w3h3.length);
    debugCandidates.w3h3.slice(0, 10).forEach((cls, idx) => console.log(`   w3h3[${idx}]:`, cls));
    console.log('🧪 调试: exact 匹配元素 class:', debugCandidates.exact);
    
    // 获取overflow样式
    const overflowStyle = await page.evaluate(() => {
      const element = document.querySelector('.top-three-section');
      return element ? window.getComputedStyle(element).overflow : 'not found';
    });
    
    console.log(`\n🎨 .top-three-section overflow 样式: ${overflowStyle}`);
    console.log(`📸 截图已保存到: ${screenshotPath}`);
    
    // 检查是否所有关键元素都存在
    const allElementsPresent = 
      results['前三名区域'] &&
      results['排名徽章数量'] >= 3 &&
      results['装饰圆圈数量'] >= 6 &&
      results['冠军闪烁星星'] &&
      results['渐变徽章数量'] >= 3;
    
    if (allElementsPresent && overflowStyle === 'visible') {
      console.log('\n🎉 所有样式元素都正确显示！前三名卡片样式修复成功！');
    } else {
      console.log('\n⚠️  部分样式元素可能未正确显示，请检查截图。');
    }
    
  } catch (error) {
    console.error('❌ 验证过程中出现错误:', error.message);
  } finally {
    await browser.close();
  }
}

// 检查是否安装了puppeteer
try {
  require.resolve('puppeteer');
  verifyTopThreeStyles();
} catch (e) {
  console.log('📦 正在安装 puppeteer...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install puppeteer', { stdio: 'inherit' });
    console.log('✅ puppeteer 安装完成，重新运行验证...');
    verifyTopThreeStyles();
  } catch (installError) {
    console.error('❌ 无法安装 puppeteer:', installError.message);
    console.log('\n🔧 手动验证步骤:');
    console.log('1. 打开 http://localhost:3000');
    console.log('2. 检查前三名卡片是否显示:');
    console.log('   - 排名徽章（右上角圆形图标）');
    console.log('   - 装饰背景圆圈（四角）');
    console.log('   - 冠军闪烁星星（左上角）');
    console.log('   - 冠军头像小皇冠');
    console.log('   - 卡片缩放效果（冠军稍大）');
  }
}