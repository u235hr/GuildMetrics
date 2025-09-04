import { chromium } from 'playwright-core';

export class BrowserTool {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async init() {
    if (!this.browser) {
      this.browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 }
      });
      this.page = await this.context.newPage();
    }
  }

  async navigate(url) {
    await this.init();
    await this.page.goto(url);
    return `Navigated to ${url}`;
  }

  async screenshot(fullPage = false) {
    await this.init();
    const screenshot = await this.page.screenshot({ fullPage });
    return screenshot;
  }

  async click(selector) {
    await this.init();
    await this.page.click(selector);
    return `Clicked on element: ${selector}`;
  }

  async type(selector, text) {
    await this.init();
    await this.page.fill(selector, text);
    return `Typed "${text}" into ${selector}`;
  }

  async getText(selector) {
    await this.init();
    const text = await this.page.textContent(selector);
    return text;
  }

  async waitFor(selector, timeout = 5000) {
    await this.init();
    await this.page.waitForSelector(selector, { timeout });
    return `Element ${selector} appeared within ${timeout}ms`;
  }

  async evaluate(script) {
    await this.init();
    const result = await this.page.evaluate(script);
    return result;
  }

  async getTitle() {
    await this.init();
    return await this.page.title();
  }

  async getUrl() {
    await this.init();
    return this.page.url();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }

  async testGuildMetrics() {
    await this.init();
    
    // 导航到本地开发服务器
    await this.navigate('http://localhost:3000');
    
    // 等待页面加载
    await this.waitFor('[data-testid="header"]', 10000);
    
    // 获取页面标题
    const title = await this.getTitle();
    console.log('页面标题:', title);
    
    // 检查关键元素
    const headerText = await this.getText('[data-testid="header"] h1');
    console.log('Header 文本:', headerText);
    
    // 检查 Top3 卡片
    const topThreeExists = await this.page.$('[data-testid="top-three"]');
    console.log('Top3 组件存在:', !!topThreeExists);
    
    // 检查排名表格
    const tableExists = await this.page.$('[data-testid="ranking-table"]');
    console.log('排名表格存在:', !!tableExists);
    
    // 截图
    const screenshot = await this.screenshot(true);
    return {
      title,
      headerText,
      topThreeExists: !!topThreeExists,
      tableExists: !!tableExists,
      screenshot
    };
  }
}

export default BrowserTool;
