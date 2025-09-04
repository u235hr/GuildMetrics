# BrowserTool MCP 集成

本项目已集成 BrowserTool MCP (Model Context Protocol) 功能，提供强大的浏览器自动化能力。

##  功能特性

### MCP 服务器功能
- **browser_navigate**: 导航到指定 URL
- **browser_screenshot**: 截取页面截图
- **browser_click**: 点击页面元素
- **browser_type**: 在输入框中输入文本
- **browser_get_text**: 获取元素文本内容
- **browser_wait_for**: 等待元素出现
- **browser_evaluate**: 执行 JavaScript 代码
- **browser_close**: 关闭浏览器

### 本地工具类功能
- 简化的 API 接口
- 自动浏览器管理
- 专门针对 GuildMetrics 应用的测试方法
- 错误处理和资源清理

##  安装和配置

### 1. 依赖安装
```bash
npm install @modelcontextprotocol/sdk playwright-core
```

### 2. 启动 MCP 服务器
```bash
npm run mcp-server
```

### 3. 运行浏览器测试
```bash
npm run test-browser
```

##  使用方法

### 基本用法
```javascript
import BrowserTool from './src/utils/BrowserTool.js';

const browser = new BrowserTool();

// 导航到页面
await browser.navigate('http://localhost:3000');

// 截图
const screenshot = await browser.screenshot(true);

// 获取元素文本
const text = await browser.getText('[data-testid="header"]');

// 执行 JavaScript
const result = await browser.evaluate('document.title');

// 关闭浏览器
await browser.close();
```

### 测试 GuildMetrics 应用
```javascript
const browser = new BrowserTool();
const result = await browser.testGuildMetrics();
console.log(result);
```

##  应用场景

1. **自动化测试**: 验证页面功能和布局
2. **视觉回归测试**: 截取页面截图进行对比
3. **性能监控**: 测量页面加载时间
4. **用户交互测试**: 模拟用户操作流程
5. **数据验证**: 检查页面显示的数据是否正确

##  文件结构

```
 mcp-server.js              # MCP 服务器主文件
 mcp-config.json            # MCP 配置文件
 test-browser-tool.js       # 浏览器工具测试脚本
 src/utils/BrowserTool.js   # 浏览器工具类
 package.json               # 包含 MCP 相关脚本
```

##  配置说明

### MCP 服务器配置
- 服务器名称: `browser-tool-mcp`
- 版本: `1.0.0`
- 传输方式: stdio
- 浏览器: Chromium (非无头模式)

### 浏览器配置
- 视口大小: 1920x1080
- 启动参数: `--no-sandbox --disable-setuid-sandbox`
- 超时设置: 默认 5000ms

##  故障排除

### 常见问题
1. **浏览器启动失败**: 检查 Playwright 安装和权限
2. **页面加载超时**: 增加等待时间或检查网络连接
3. **元素选择器错误**: 使用浏览器开发者工具验证选择器

### 调试技巧
- 使用 `headless: false` 查看浏览器操作
- 添加 `console.log` 输出调试信息
- 使用 `page.pause()` 暂停执行进行调试

##  相关文档

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Playwright 文档](https://playwright.dev/)
- [Next.js 测试指南](https://nextjs.org/docs/testing)

##  贡献

欢迎提交 Issue 和 Pull Request 来改进 BrowserTool MCP 功能！
