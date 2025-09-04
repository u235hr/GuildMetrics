import { BrowserTool } from './src/utils/BrowserTool.js';

async function checkNumbers() {
  const browser = new BrowserTool();
  
  try {
    await browser.navigate('http://localhost:3000');
    await browser.waitFor('[data-testid="top-three"]', 5000);
    
    // 检查柱状图上的数字
    const barNumbers = await browser.page.evaluate(() => {
      const bars = document.querySelectorAll('[data-testid="top-three"] .relative.flex.flex-col.items-center');
      const numbers = [];
      
      bars.forEach((bar, index) => {
        const rankElement = bar.querySelector('.text-white.font-bold.text-lg');
        const nameElement = bar.querySelector('.text-white.font-bold.text-lg');
        const championTag = bar.querySelector('.bg-yellow-500');
        
        numbers.push({
          index: index,
          rankText: rankElement ? rankElement.textContent : 'none',
          nameText: nameElement ? nameElement.textContent : 'none',
          hasChampionTag: !!championTag,
          championText: championTag ? championTag.textContent : 'none'
        });
      });
      
      return numbers;
    });
    
    console.log('柱状图数字检查:');
    barNumbers.forEach((item, index) => {
      console.log(`柱状图 ${index + 1}:`);
      console.log(`  排名文本: ${item.rankText}`);
      console.log(`  名字文本: ${item.nameText}`);
      console.log(`  有冠军标签: ${item.hasChampionTag}`);
      console.log(`  冠军标签文本: ${item.championText}`);
      console.log('');
    });
    
    // 检查所有文本元素
    const allTexts = await browser.page.evaluate(() => {
      const elements = document.querySelectorAll('[data-testid="top-three"] *');
      const texts = [];
      
      elements.forEach((el, index) => {
        if (el.textContent && el.textContent.trim() && el.children.length === 0) {
          texts.push({
            tag: el.tagName,
            text: el.textContent.trim(),
            className: el.className,
            position: el.getBoundingClientRect()
          });
        }
      });
      
      return texts;
    });
    
    console.log('所有文本元素:');
    allTexts.forEach((item, index) => {
      console.log(`${index + 1}. ${item.tag}: "${item.text}"`);
      console.log(`   类名: ${item.className}`);
      console.log(`   位置: x=${item.position.x}, y=${item.position.y}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('检查失败:', error.message);
  } finally {
    await browser.close();
  }
}

checkNumbers();
