const puppeteer = require('puppeteer');
const fs = require('fs');

// 测试视口尺寸 - 包含多种分辨率
const viewportSizes = [
  { name: '4K-Desktop', width: 3840, height: 2160 },
  { name: '1080p-Desktop', width: 1920, height: 1080 },
  { name: '1440p-Desktop', width: 2560, height: 1440 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Small-Laptop', width: 1280, height: 800 },
  { name: 'Tablet-Landscape', width: 1024, height: 768 },
  { name: 'Tablet-Portrait', width: 768, height: 1024 },
  { name: 'Mobile-Large', width: 414, height: 896 },
  { name: 'Mobile-Medium', width: 375, height: 667 },
  { name: 'Mobile-Small', width: 320, height: 568 }
];

(async () => {
  console.log('🚀 启动自适应布局验证...');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    console.log('📱 正在加载页面...');
    const targetUrl = process.env.VERIFY_URL || 'http://localhost:3002';
    await page.goto(targetUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // 等待关键组件加载
    console.log('⏳ 等待关键组件加载...');
    await page.waitForSelector('.adaptive-layout', { timeout: 10000 });
    await page.waitForSelector('.top-three-section', { timeout: 10000 });
    await page.waitForSelector('.ranking-section', { timeout: 10000 });
    
    console.log('🔍 开始多分辨率验证...');
    
    const results = [];
    
    for (const viewport of viewportSizes) {
      console.log(`\n📐 测试 ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      // 设置视口
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1
      });
      
      // 等待布局调整
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 验证关键元素
      const layoutCheck = await page.evaluate(() => {
        const adaptiveLayout = document.querySelector('.adaptive-layout');
        const topThreeSection = document.querySelector('.top-three-section');
        const rankingSection = document.querySelector('.ranking-section');
        const dashboardContainer = document.querySelector('.dashboard-content-container');
        
        if (!adaptiveLayout || !topThreeSection || !rankingSection || !dashboardContainer) {
          return { error: '关键元素未找到' };
        }
        
        const adaptiveRect = adaptiveLayout.getBoundingClientRect();
        const topThreeRect = topThreeSection.getBoundingClientRect();
        const rankingRect = rankingSection.getBoundingClientRect();
        const containerRect = dashboardContainer.getBoundingClientRect();
        
        // 检查样式
        const adaptiveStyles = window.getComputedStyle(adaptiveLayout);
        const topThreeStyles = window.getComputedStyle(topThreeSection);
        const rankingStyles = window.getComputedStyle(rankingSection);
        const containerStyles = window.getComputedStyle(dashboardContainer);
        
        // 验证溢出处理
        const hasOverflow = {
          adaptive: adaptiveRect.width > window.innerWidth || adaptiveRect.height > window.innerHeight,
          topThree: topThreeRect.width > containerRect.width,
          ranking: rankingRect.width > containerRect.width
        };
        
        // 验证Grid/Flex布局
        const layoutMethods = {
          adaptive: adaptiveStyles.display,
          container: containerStyles.display,
          topThree: topThreeStyles.display,
          ranking: rankingStyles.display
        };
        
        // 检查滚动设置
        const scrollSettings = {
          adaptive: adaptiveStyles.overflow || adaptiveStyles.overflowY,
          container: containerStyles.overflow || containerStyles.overflowY,
          ranking: rankingStyles.overflow || rankingStyles.overflowY
        };
        
        // 检查相对单位使用（基于作者样式而非计算值）
        const getAuthoredValue = (selector, propNames) => {
          let value = '';
          const names = Array.isArray(propNames) ? propNames : [propNames];
          for (const sheet of Array.from(document.styleSheets)) {
            let rules;
            try { rules = sheet.cssRules || sheet.rules; } catch (e) { continue; }
            if (!rules) continue;
            for (const rule of Array.from(rules)) {
              if (rule.type === CSSRule.STYLE_RULE && rule.selectorText) {
                const selectors = rule.selectorText.split(',').map(s => s.trim());
                if (selectors.includes('.dashboard-content-container')) {
                  for (const n of names) {
                    const v = rule.style.getPropertyValue(n);
                    if (v) value = v.trim();
                  }
                }
              }
            }
          }
          return value;
        };
        const authoredPadding = getAuthoredValue('.dashboard-content-container', ['padding','padding-inline','padding-block']);
        const authoredGap = getAuthoredValue('.dashboard-content-container', ['gap','row-gap','column-gap']);
        const checkUnits = v => typeof v === 'string' && (v.includes('clamp(') || v.includes('vw') || v.includes('vh') || v.includes('rem') || v.includes('%') || v.includes('fr'));
        const usesRelativeUnits = {
          containerPadding: checkUnits(authoredPadding) || checkUnits(containerStyles.padding),
          containerGap: checkUnits(authoredGap) || checkUnits(containerStyles.gap)
        };
        
        return {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          elements: {
            adaptive: { width: adaptiveRect.width, height: adaptiveRect.height },
            topThree: { width: topThreeRect.width, height: topThreeRect.height },
            ranking: { width: rankingRect.width, height: rankingRect.height },
            container: { width: containerRect.width, height: containerRect.height }
          },
          hasOverflow,
          layoutMethods,
          scrollSettings,
          usesRelativeUnits
        };
      });
      
      if (layoutCheck.error) {
        console.log(`❌ ${viewport.name}: ${layoutCheck.error}`);
        continue;
      }
      
      // 检查表格滚动
      const tableScrollCheck = await page.evaluate(() => {
        const rankingContainer = document.querySelector('.ranking-table-container') ||
                               document.querySelector('.ranking-section .internal-scroll') ||
                               document.querySelector('.ranking-section [class*="scroll"]') ||
                               document.querySelector('.table-body-scroll');
        
        if (!rankingContainer) {
          return { hasScrollableTable: false, error: '未找到可滚动表格容器' };
        }
        
        const styles = window.getComputedStyle(rankingContainer);
        const rect = rankingContainer.getBoundingClientRect();
        
        return {
          hasScrollableTable: true,
          overflow: styles.overflow || styles.overflowY,
          height: styles.height,
          maxHeight: styles.maxHeight,
          scrollHeight: rankingContainer.scrollHeight,
          clientHeight: rankingContainer.clientHeight,
          isScrollable: rankingContainer.scrollHeight > rankingContainer.clientHeight
        };
      });
      
      // 拍照存证
      const screenshotPath = `layout-verification-${viewport.name}-${viewport.width}x${viewport.height}.png`;
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: false,
        type: 'png'
      });
      
      const result = {
        viewport: viewport.name,
        size: `${viewport.width}x${viewport.height}`,
        layoutCheck,
        tableScrollCheck,
        screenshot: screenshotPath
      };
      
      results.push(result);
      
      // 输出当前测试结果
      console.log(`   📊 布局方法: ${JSON.stringify(layoutCheck.layoutMethods)}`);
      console.log(`   📏 溢出检查: ${JSON.stringify(layoutCheck.hasOverflow)}`);
      console.log(`   📜 滚动设置: ${JSON.stringify(layoutCheck.scrollSettings)}`);
      console.log(`   📐 相对单位: ${JSON.stringify(layoutCheck.usesRelativeUnits)}`);
      console.log(`   🔄 表格滚动: ${tableScrollCheck.hasScrollableTable ? '✓' : '✗'} (${tableScrollCheck.overflow || 'N/A'})`);
      console.log(`   📸 截图: ${screenshotPath}`);
    }
    
    // 生成汇总报告
    console.log('\n📋 生成验证报告...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: results.length,
        passedTests: results.filter(r => !r.layoutCheck.error && 
                                      !Object.values(r.layoutCheck.hasOverflow).some(v => v)).length,
        failedTests: results.filter(r => r.layoutCheck.error ||
                                      Object.values(r.layoutCheck.hasOverflow).some(v => v)).length
      },
      results
    };
    
    fs.writeFileSync('adaptive-layout-verification-report.json', JSON.stringify(report, null, 2));
    
    // 输出汇总
    console.log('\n🎯 验证完成！');
    console.log(`✅ 通过测试: ${report.summary.passedTests}/${report.summary.totalTests}`);
    console.log(`❌ 失败测试: ${report.summary.failedTests}/${report.summary.totalTests}`);
    
    // 检查关键要求
    const hasGridLayout = results.some(r => 
      r.layoutCheck.layoutMethods?.adaptive === 'grid' ||
      r.layoutCheck.layoutMethods?.container === 'flex'
    );
    
    const hasRelativeUnits = results.some(r =>
      r.layoutCheck.usesRelativeUnits?.containerPadding ||
      r.layoutCheck.usesRelativeUnits?.containerGap
    );
    
    const hasProperScrolling = results.some(r =>
      r.tableScrollCheck.hasScrollableTable &&
      (r.tableScrollCheck.overflow === 'auto' || 
       r.tableScrollCheck.overflow === 'scroll' ||
       r.tableScrollCheck.overflow?.includes('auto'))
    );
    
    console.log(`\n🔍 关键要求检查:`);
    console.log(`   Grid/Flex布局: ${hasGridLayout ? '✅' : '❌'}`);
    console.log(`   相对单位使用: ${hasRelativeUnits ? '✅' : '❌'}`);
    console.log(`   内部滚动设置: ${hasProperScrolling ? '✅' : '❌'}`);
    
    console.log(`\n📄 详细报告已保存: adaptive-layout-verification-report.json`);
    console.log(`📸 截图已保存到当前目录`);
    
  } catch (error) {
    console.error('❌ 验证过程出错:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();