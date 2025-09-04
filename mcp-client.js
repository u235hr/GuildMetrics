import { spawn } from 'child_process';
import { createInterface } from 'readline';

class MCPClient {
  constructor() {
    this.server = null;
    this.rl = null;
  }

  async start() {
    console.log(' 启动 MCP 客户端...');
    
    // 启动 MCP 服务器
    this.server = spawn('node', ['mcp-server.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // 创建 readline 接口
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // 处理服务器输出
    this.server.stdout.on('data', (data) => {
      console.log(' 服务器响应:', data.toString());
    });

    this.server.stderr.on('data', (data) => {
      console.log(' 服务器错误:', data.toString());
    });

    // 处理用户输入
    this.rl.on('line', (input) => {
      if (input.trim() === 'quit') {
        this.stop();
        return;
      }
      
      // 发送命令到服务器
      this.server.stdin.write(input + '\n');
    });

    console.log(' MCP 客户端已启动');
    console.log(' 输入 "quit" 退出');
  }

  stop() {
    if (this.server) {
      this.server.kill();
    }
    if (this.rl) {
      this.rl.close();
    }
    console.log(' MCP 客户端已关闭');
    process.exit(0);
  }
}

// 启动客户端
const client = new MCPClient();
client.start();
