// 安全的日志工具，避免ByteString编码错误

export const safeLog = {
  info: (message: string, ...args: any[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // 将中文字符转换为安全的ASCII格式
      const safeMessage = encodeLogMessage(message);
      console.log(safeMessage, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const safeMessage = encodeLogMessage(message);
      console.warn(safeMessage, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    if (typeof window !== 'undefined') {
      const safeMessage = encodeLogMessage(message);
      console.error(safeMessage, ...args);
    }
  },
  
  performance: (message: string, data?: any) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const safeMessage = encodeLogMessage(message);
      console.log(`[PERF] ${safeMessage}`, data || '');
    }
  }
};

// 将包含中文的字符串转换为安全格式
function encodeLogMessage(message: string): string {
  try {
    // 检查是否包含中文字符
    if (/[\u4e00-\u9fff]/.test(message)) {
      // 将中文字符转换为Unicode转义序列
      return message.replace(/[\u4e00-\u9fff]/g, (char) => {
        return `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`;
      });
    }
    return message;
  } catch (error) {
    // 如果转换失败，返回英文替代消息
    return '[LOG_ENCODING_ERROR] Message contains unsafe characters';
  }
}

// 性能监控专用日志格式
export const formatPerformanceLog = (fps: number, memory: number, frameTime: number, level: string): string => {
  const report = [
    '========== Performance Report ==========',
    `FPS: ${fps} | Memory: ${memory}MB | Frame: ${frameTime.toFixed(1)}ms`,
    `Level: ${level} | Time: ${new Date().toLocaleTimeString()}`,
    '========================================'
  ].join('\n');
  
  return encodeLogMessage(report);
};

// 动画日志专用格式
export const formatAnimationLog = (step: string, status: string): string => {
  return encodeLogMessage(`[ANIM] ${step}: ${status}`);
};