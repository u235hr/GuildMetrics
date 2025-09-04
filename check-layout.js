import { BrowserTool } from './src/utils/BrowserTool.js';

async function checkLayout() {
  const browser = new BrowserTool();
  
  try {
    await browser.navigate('http://localhost:3000');
    await browser.waitFor('[data-testid="top-three"]', 5000);
    
    // 检查各个区域的位置和大小
    const layoutInfo = await browser.page.evaluate(() => {
      const topThree = document.querySelector('[data-testid="top-three"]');
      const rankingTable = document.querySelector('[data-testid="ranking-table"]');
      
      const topThreeRect = topThree ? topThree.getBoundingClientRect() : null;
      const tableRect = rankingTable ? rankingTable.getBoundingClientRect() : null;
      
      // 查找礼物值元素
      const giftValues = Array.from(document.querySelectorAll('[data-testid="top-three"] .bg-black\\/80')).map(el => ({
        text: el.textContent.trim(),
        rect: el.getBoundingClientRect()
      }));
      
      return {
        topThree: topThreeRect ? {
          top: topThreeRect.top,
          bottom: topThreeRect.bottom,
          height: topThreeRect.height
        } : null,
        table: tableRect ? {
          top: tableRect.top,
          bottom: tableRect.bottom,
          height: tableRect.height
        } : null,
        giftValues,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
    
    console.log('布局检查结果:');
    console.log('='.repeat(50));
    
    if (layoutInfo.topThree) {
      console.log(`Top3 区域:`);
      console.log(`  顶部: ${layoutInfo.topThree.top}px`);
      console.log(`  底部: ${layoutInfo.topThree.bottom}px`);
      console.log(`  高度: ${layoutInfo.topThree.height}px`);
    }
    
    if (layoutInfo.table) {
      console.log(`\n排名表格:`);
      console.log(`  顶部: ${layoutInfo.table.top}px`);
      console.log(`  底部: ${layoutInfo.table.bottom}px`);
      console.log(`  高度: ${layoutInfo.table.height}px`);
    }
    
    if (layoutInfo.topThree && layoutInfo.table) {
      const gap = layoutInfo.table.top - layoutInfo.topThree.bottom;
      console.log(`\n区域间距: ${gap}px`);
      if (gap < 0) {
        console.log('  重叠检测: 表格与Top3区域重叠!');
      }
    }
    
    console.log(`\n礼物值位置:`);
    layoutInfo.giftValues.forEach((gift, index) => {
      console.log(`  ${index + 1}. "${gift.text.split('\n')[0]}"`);
      console.log(`     顶部: ${gift.rect.top}px, 底部: ${gift.rect.bottom}px`);
    });
    
    console.log(`\n视窗大小: ${layoutInfo.viewport.width}x${layoutInfo.viewport.height}`);
    
    // 检查是否有元素被遮挡
    if (layoutInfo.table) {
      const blockedGifts = layoutInfo.giftValues.filter(gift => gift.rect.bottom > layoutInfo.table.top);
      if (blockedGifts.length > 0) {
        console.log(`\n 被遮挡的礼物值: ${blockedGifts.length}个`);
        blockedGifts.forEach((gift, index) => {
          console.log(`   ${index + 1}. "${gift.text.split('\n')[0]}" (底部: ${gift.rect.bottom}px)`);
        });
      }
    }
    
  } catch (error) {
    console.error('检查失败:', error.message);
  } finally {
    await browser.close();
  }
}

checkLayout();
