import BrowserTool from './src/utils/BrowserTool.js';

async function demonstrateBrowserTool() {
  const browser = new BrowserTool();
  
  try {
    console.log(' BrowserTool MCP 功能演示');
    console.log('================================');
    
    // 1. 导航到主页
    console.log('\n1 导航到主页...');
    await browser.navigate('http://localhost:3000');
    const title = await browser.getTitle();
    console.log(` 页面标题: ${title}`);
    
    // 2. 检查页面元素
    console.log('\n2 检查页面元素...');
    const headerText = await browser.getText('[data-testid="header"] h1');
    console.log(` Header 文本: ${headerText}`);
    
    // 3. 获取页面信息
    console.log('\n3 获取页面信息...');
    const pageInfo = await browser.evaluate(`
      ({
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        elements: {
          header: !!document.querySelector('[data-testid="header"]'),
          topThree: !!document.querySelector('[data-testid="top-three"]'),
          table: !!document.querySelector('[data-testid="ranking-table"]')
        }
      })
    `);
    console.log(' 页面信息:', JSON.stringify(pageInfo, null, 2));
    
    // 4. 测试导航到排行榜
    console.log('\n4 测试页面导航...');
    await browser.navigate('http://localhost:3000/ranking');
    const rankingUrl = await browser.getUrl();
    console.log(` 当前 URL: ${rankingUrl}`);
    
    // 5. 检查面包屑导航
    console.log('\n5 检查面包屑导航...');
    try {
      const breadcrumb = await browser.getText('nav');
      console.log(` 面包屑: ${breadcrumb}`);
    } catch (error) {
      console.log(' 面包屑未找到');
    }
    
    // 6. 获取表格数据
    console.log('\n6 获取表格数据...');
    const tableData = await browser.evaluate(`
      Array.from(document.querySelectorAll('[data-testid^="row-"]')).map(row => ({
        rank: row.querySelector('td:first-child')?.textContent,
        name: row.querySelector('td:nth-child(2)')?.textContent,
        amount: row.querySelector('td:nth-child(3)')?.textContent
      })).slice(0, 5)
    `);
    console.log(' 前5行数据:', JSON.stringify(tableData, null, 2));
    
    // 7. 截图
    console.log('\n7 截取页面截图...');
    const screenshot = await browser.screenshot(true);
    console.log(` 截图完成，大小: ${screenshot.length} bytes`);
    
    console.log('\n BrowserTool MCP 演示完成！');
    console.log(' 所有功能都正常工作！');
    
  } catch (error) {
    console.error(' 演示过程中出错:', error.message);
  } finally {
    await browser.close();
    console.log('\n 浏览器已关闭');
  }
}

// 运行演示
demonstrateBrowserTool();
