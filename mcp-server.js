#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium } from 'playwright-core';

class BrowserToolMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'browser-tool-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.browser = null;
    this.context = null;
    this.page = null;

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'browser_navigate',
            description: 'Navigate to a URL in the browser',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The URL to navigate to',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'browser_screenshot',
            description: 'Take a screenshot of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                fullPage: {
                  type: 'boolean',
                  description: 'Whether to capture the full page',
                  default: false,
                },
              },
            },
          },
          {
            name: 'browser_click',
            description: 'Click on an element',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element to click',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'browser_type',
            description: 'Type text into an input field',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the input field',
                },
                text: {
                  type: 'string',
                  description: 'Text to type',
                },
              },
              required: ['selector', 'text'],
            },
          },
          {
            name: 'browser_get_text',
            description: 'Get text content from an element',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'browser_wait_for',
            description: 'Wait for an element to appear',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element to wait for',
                },
                timeout: {
                  type: 'number',
                  description: 'Timeout in milliseconds',
                  default: 5000,
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'browser_evaluate',
            description: 'Execute JavaScript in the browser context',
            inputSchema: {
              type: 'object',
              properties: {
                script: {
                  type: 'string',
                  description: 'JavaScript code to execute',
                },
              },
              required: ['script'],
            },
          },
          {
            name: 'browser_close',
            description: 'Close the browser',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'browser_navigate':
            return await this.navigate(args.url);
          case 'browser_screenshot':
            return await this.screenshot(args.fullPage);
          case 'browser_click':
            return await this.click(args.selector);
          case 'browser_type':
            return await this.type(args.selector, args.text);
          case 'browser_get_text':
            return await this.getText(args.selector);
          case 'browser_wait_for':
            return await this.waitFor(args.selector, args.timeout);
          case 'browser_evaluate':
            return await this.evaluate(args.script);
          case 'browser_close':
            return await this.close();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async ensureBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: false });
      this.context = await this.browser.newContext();
      this.page = await this.context.newPage();
    }
  }

  async navigate(url) {
    await this.ensureBrowser();
    await this.page.goto(url);
    return {
      content: [
        {
          type: 'text',
          text: `Navigated to ${url}`,
        },
      ],
    };
  }

  async screenshot(fullPage = false) {
    await this.ensureBrowser();
    const screenshot = await this.page.screenshot({ fullPage });
    const base64 = screenshot.toString('base64');
    return {
      content: [
        {
          type: 'text',
          text: `Screenshot taken (${fullPage ? 'full page' : 'viewport'})`,
        },
        {
          type: 'image',
          data: base64,
          mimeType: 'image/png',
        },
      ],
    };
  }

  async click(selector) {
    await this.ensureBrowser();
    await this.page.click(selector);
    return {
      content: [
        {
          type: 'text',
          text: `Clicked on element: ${selector}`,
        },
      ],
    };
  }

  async type(selector, text) {
    await this.ensureBrowser();
    await this.page.fill(selector, text);
    return {
      content: [
        {
          type: 'text',
          text: `Typed "${text}" into ${selector}`,
        },
      ],
    };
  }

  async getText(selector) {
    await this.ensureBrowser();
    const text = await this.page.textContent(selector);
    return {
      content: [
        {
          type: 'text',
          text: `Text from ${selector}: ${text}`,
        },
      ],
    };
  }

  async waitFor(selector, timeout = 5000) {
    await this.ensureBrowser();
    await this.page.waitForSelector(selector, { timeout });
    return {
      content: [
        {
          type: 'text',
          text: `Element ${selector} appeared within ${timeout}ms`,
        },
      ],
    };
  }

  async evaluate(script) {
    await this.ensureBrowser();
    const result = await this.page.evaluate(script);
    return {
      content: [
        {
          type: 'text',
          text: `Script result: ${JSON.stringify(result)}`,
        },
      ],
    };
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
    return {
      content: [
        {
          type: 'text',
          text: 'Browser closed',
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Browser Tool MCP server running on stdio');
  }
}

const server = new BrowserToolMCPServer();
server.run().catch(console.error);
