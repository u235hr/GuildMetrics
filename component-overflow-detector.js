/**
 * 组件内容溢出专用检测器
 * 专门检测组件内元素被外框遮挡导致显示不完全的问题
 */
class ComponentContentOverflowDetector {
  constructor() {
    this.issues = [];
    this.componentSelectors = [
      '.top-three-card',
      '.streamer-info', 
      '.text-info',
      '.ranking-table-cell',
      '.modern-stat-card',
      '.card-content',
      '.streamer-name',
      '.gift-value',
      '.medal-text'
    ];
  }

  /**
   * 检测组件内文本溢出
   */
  detectTextOverflow() {
    const results = [];
    
    this.componentSelectors.forEach(selector => {
      const components = document.querySelectorAll(selector);
      
      components.forEach((component, index) => {
        const textElements = component.querySelectorAll(
          'h1, h2, h3, h4, h5, h6, p, span, div[class*="name"], div[class*="text"], div[class*="value"]'
        );
        
        textElements.forEach(textEl => {
          const overflow = this.checkTextElementOverflow(textEl, component);
          if (overflow.hasOverflow) {
            results.push({
              type: 'component-text-overflow',
              component: {
                selector,
                index,
                element: component,
                rect: component.getBoundingClientRect(),
                classList: Array.from(component.classList)
              },
              textElement: {
                element: textEl,
                content: textEl.textContent?.substring(0, 50) + '...',
                fullContent: textEl.textContent,
                rect: textEl.getBoundingClientRect(),
                computedStyle: this.getRelevantStyles(textEl),
                classList: Array.from(textEl.classList)
              },
              overflow: overflow,
              suggestions: this.generateFixSuggestions(overflow)
            });
          }
        });
      });
    });
    
    return results;
  }

  /**
   * 检查单个文本元素是否溢出
   */
  checkTextElementOverflow(textEl, container) {
    const textRect = textEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const style = getComputedStyle(textEl);
    
    const overflow = {
      hasOverflow: false,
      horizontalOverflow: 0,
      verticalOverflow: 0,
      isClipped: false,
      hasEllipsis: false,
      scrollable: false,
      details: []
    };
    
    // 检测水平溢出
    if (textRect.right > containerRect.right + 1) { // +1容错
      overflow.hasOverflow = true;
      overflow.horizontalOverflow = textRect.right - containerRect.right;
      overflow.details.push(`文本右边缘超出容器 ${overflow.horizontalOverflow.toFixed(1)}px`);
    }
    
    if (textRect.left < containerRect.left - 1) { // -1容错
      overflow.hasOverflow = true;
      const leftOverflow = containerRect.left - textRect.left;
      overflow.details.push(`文本左边缘超出容器 ${leftOverflow.toFixed(1)}px`);
    }
    
    // 检测垂直溢出
    if (textRect.bottom > containerRect.bottom + 1) { // +1容错
      overflow.hasOverflow = true;
      overflow.verticalOverflow = textRect.bottom - containerRect.bottom;
      overflow.details.push(`文本底部超出容器 ${overflow.verticalOverflow.toFixed(1)}px`);
    }
    
    if (textRect.top < containerRect.top - 1) { // -1容错
      overflow.hasOverflow = true;
      const topOverflow = containerRect.top - textRect.top;
      overflow.details.push(`文本顶部超出容器 ${topOverflow.toFixed(1)}px`);
    }
    
    // 检测是否被裁剪
    if (style.overflow === 'hidden' || style.textOverflow === 'ellipsis') {
      overflow.isClipped = true;
      overflow.hasEllipsis = style.textOverflow === 'ellipsis';
      
      // 检查实际文本宽度是否超过容器
      const textWidth = this.measureTextWidth(textEl.textContent, style);
      if (textWidth > textRect.width + 2) { // +2容错
        overflow.hasOverflow = true;
        overflow.horizontalOverflow = Math.max(overflow.horizontalOverflow, textWidth - textRect.width);
        overflow.details.push(`实际文本宽度 ${textWidth.toFixed(1)}px 超过显示宽度 ${textRect.width.toFixed(1)}px`);
      }
    }
    
    // 检测是否可滚动但没有显示滚动条
    const isScrollable = textEl.scrollWidth > textEl.clientWidth || 
                        textEl.scrollHeight > textEl.clientHeight;
    if (isScrollable) {
      overflow.scrollable = true;
      overflow.details.push('内容可滚动但可能没有显示滚动条');
    }
    
    // 检测字体大小是否过大
    const fontSize = parseFloat(style.fontSize);
    const containerHeight = containerRect.height;
    if (fontSize > containerHeight * 0.8) {
      overflow.hasOverflow = true;
      overflow.details.push(`字体过大: ${fontSize}px, 容器高度: ${containerHeight.toFixed(1)}px`);
    }
    
    return overflow;
  }

  /**
   * 测量文本实际宽度
   */
  measureTextWidth(text, style) {
    if (!text) return 0;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    return context.measureText(text).width;
  }

  /**
   * 获取相关样式信息
   */
  getRelevantStyles(element) {
    const style = getComputedStyle(element);
    return {
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      width: style.width,
      height: style.height,
      maxWidth: style.maxWidth,
      maxHeight: style.maxHeight,
      overflow: style.overflow,
      textOverflow: style.textOverflow,
      whiteSpace: style.whiteSpace,
      wordWrap: style.wordWrap,
      overflowWrap: style.overflowWrap,
      display: style.display,
      position: style.position
    };
  }

  /**
   * 生成修复建议
   */
  generateFixSuggestions(overflow) {
    const suggestions = [];
    
    if (overflow.horizontalOverflow > 0) {
      suggestions.push({
        type: 'horizontal-fix',
        priority: 'high',
        methods: [
          '使用 min-width: 0 在父容器上允许flex项收缩',
          '调整 clamp() 函数的最小值，确保在小屏幕上有合适的字体大小',
          '使用 overflow-wrap: break-word 允许长单词换行',
          '增加容器的最小宽度或使用flex-grow',
          '使用 text-overflow: ellipsis 配合 overflow: hidden',
          '实现动态字体大小调整'
        ]
      });
    }
    
    if (overflow.verticalOverflow > 0) {
      suggestions.push({
        type: 'vertical-fix',
        priority: 'medium',
        methods: [
          '增加容器高度的 clamp() 最小值',
          '使用 -webkit-line-clamp 属性限制行数',
          '调整 line-height 和 font-size 的比例',
          '实现垂直滚动或内容截断',
          '使用 flex-shrink: 0 防止容器被压缩'
        ]
      });
    }
    
    if (overflow.isClipped && overflow.hasEllipsis) {
      suggestions.push({
        type: 'ellipsis-optimization',
        priority: 'medium', 
        methods: [
          '添加 title 属性显示完整内容',
          '实现 Tooltip 组件显示完整文本',
          '添加点击展开功能',
          '使用更智能的文本截断算法',
          '动态调整字体大小以适应容器'
        ]
      });
    }
    
    if (overflow.scrollable) {
      suggestions.push({
        type: 'scroll-optimization',
        priority: 'low',
        methods: [
          '添加自定义滚动条样式',
          '实现滚动指示器',
          '优化滚动交互体验',
          '考虑使用虚拟滚动优化性能'
        ]
      });
    }
    
    return suggestions;
  }

  /**
   * 实时监控组件变化
   */
  startRealTimeMonitoring() {
    console.log('🔍 开始实时监控组件溢出问题...');
    
    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (this.componentSelectors.some(sel => 
          entry.target.matches(sel) || entry.target.querySelector(sel)
        )) {
          setTimeout(() => {
            const issues = this.detectTextOverflow();
            if (issues.length > 0) {
              console.warn('⚠️ 检测到组件内容溢出问题:', issues);
              this.highlightIssues(issues);
            }
          }, 100);
        }
      });
    });
    
    // 观察所有相关组件
    document.querySelectorAll(this.componentSelectors.join(', ')).forEach(el => {
      observer.observe(el);
    });
    
    return observer;
  }

  /**
   * 高亮显示问题元素
   */
  highlightIssues(issues) {
    // 清除之前的高亮
    document.querySelectorAll('.overflow-issue-highlight').forEach(el => el.remove());
    
    issues.forEach((issue, index) => {
      const highlight = document.createElement('div');
      highlight.className = 'overflow-issue-highlight';
      highlight.style.cssText = `
        position: fixed;
        background: rgba(255, 0, 0, 0.2);
        border: 2px solid #ff0000;
        pointer-events: none;
        z-index: 10000;
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
      `;
      
      const rect = issue.textElement.rect;
      highlight.style.left = rect.left + 'px';
      highlight.style.top = rect.top + 'px';
      highlight.style.width = rect.width + 'px';
      highlight.style.height = rect.height + 'px';
      
      // 添加问题标签
      const label = document.createElement('div');
      label.style.cssText = `
        position: absolute;
        top: -25px;
        left: 0;
        background: #ff0000;
        color: white;
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 3px;
        white-space: nowrap;
        font-family: monospace;
      `;
      label.textContent = `溢出${index + 1}`;
      highlight.appendChild(label);
      
      document.body.appendChild(highlight);
      
      // 5秒后移除高亮
      setTimeout(() => {
        if (highlight.parentNode) {
          highlight.parentNode.removeChild(highlight);
        }
      }, 5000);
    });
  }

  /**
   * 生成详细的检测报告
   */
  generateDetailedReport() {
    const issues = this.detectTextOverflow();
    
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      categories: {
        horizontal: issues.filter(i => i.overflow.horizontalOverflow > 0).length,
        vertical: issues.filter(i => i.overflow.verticalOverflow > 0).length,
        clipped: issues.filter(i => i.overflow.isClipped).length,
        scrollable: issues.filter(i => i.overflow.scrollable).length
      },
      details: issues,
      summary: this.generateSummary(issues)
    };
    
    console.group('📋 组件溢出检测报告');
    console.log('检测时间:', report.timestamp);
    console.log('总问题数:', report.totalIssues);
    console.log('问题分类:', report.categories);
    
    if (issues.length > 0) {
      console.group('详细问题列表:');
      issues.forEach((issue, index) => {
        console.group(`问题 ${index + 1}: ${issue.component.selector}`);
        console.log('组件:', issue.component.element);
        console.log('文本元素:', issue.textElement.element);
        console.log('内容:', issue.textElement.fullContent);
        console.log('溢出详情:', issue.overflow.details);
        console.log('修复建议:', issue.suggestions);
        console.groupEnd();
      });
      console.groupEnd();
    }
    
    console.log('摘要建议:', report.summary);
    console.groupEnd();
    
    return report;
  }

  /**
   * 生成修复摘要
   */
  generateSummary(issues) {
    if (issues.length === 0) {
      return ['✅ 未检测到组件内容溢出问题，布局良好！'];
    }
    
    const summary = [
      `⚠️ 检测到 ${issues.length} 个组件内容溢出问题`
    ];
    
    const componentIssues = {};
    issues.forEach(issue => {
      const selector = issue.component.selector;
      if (!componentIssues[selector]) {
        componentIssues[selector] = [];
      }
      componentIssues[selector].push(issue);
    });
    
    Object.entries(componentIssues).forEach(([selector, selectorIssues]) => {
      summary.push(`• ${selector}: ${selectorIssues.length} 个问题`);
    });
    
    summary.push('');
    summary.push('🔧 主要修复建议:');
    summary.push('1. 检查 clamp() 函数的最小值设置');
    summary.push('2. 确保flex容器使用 min-width: 0');
    summary.push('3. 为长文本添加智能截断和省略号');
    summary.push('4. 考虑实现响应式字体大小');
    summary.push('5. 添加title属性显示完整内容');
    
    return summary;
  }
}

// 自适应失效检测器
class AdaptiveLayoutFailureDetector {
  constructor() {
    this.failures = [];
    this.targetComponents = [
      '.top-three-card .text-info',
      '.streamer-name',
      '.gift-value', 
      '.medal-text',
      '.ranking-table-cell',
      '.card-content',
      '.streamer-info'
    ];
  }

  /**
   * 检测固定尺寸使用
   */
  detectFixedSizeUsage() {
    const results = [];
    
    this.targetComponents.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(el => {
        const style = getComputedStyle(el);
        const issues = [];
        
        // 检查固定像素值
        ['width', 'height', 'fontSize', 'padding', 'margin', 'lineHeight'].forEach(prop => {
          const value = style[prop];
          if (value && value.includes('px') && !value.includes('clamp') && !value.includes('calc')) {
            const numValue = parseFloat(value);
            if (numValue > 0) {
              issues.push({
                property: prop,
                value: value,
                type: 'fixed-px-value',
                recommendation: `使用 clamp() 替换: clamp(${Math.round(numValue * 0.7)}px, ${Math.round(numValue / 16)}rem, ${Math.round(numValue * 1.3)}px)`
              });
            }
          }
        });
        
        // 检查min-width: 0缺失
        if (style.display.includes('flex') && style.minWidth !== '0px' && style.minWidth !== 'auto') {
          const parent = el.parentElement;
          if (parent && getComputedStyle(parent).display.includes('flex')) {
            issues.push({
              property: 'min-width',
              value: style.minWidth,
              type: 'missing-min-width-zero',
              recommendation: '添加 min-width: 0 以允许flex项收缩'
            });
          }
        }
        
        // 检查overflow处理
        if (style.overflow === 'visible' && el.scrollWidth > el.clientWidth) {
          issues.push({
            property: 'overflow',
            value: style.overflow,
            type: 'missing-overflow-handling',
            recommendation: '添加 overflow: hidden 或 overflow: auto 处理溢出内容'
          });
        }
        
        if (issues.length > 0) {
          results.push({
            selector,
            element: el,
            issues,
            rect: el.getBoundingClientRect(),
            computedStyle: this.getRelevantStyles(el)
          });
        }
      });
    });
    
    return results;
  }

  /**
   * 检测响应式断点失效
   */
  async testResponsiveBreakpoints() {
    const breakpoints = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 375, height: 667, name: 'mobile-medium' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop-small' },
      { width: 1440, height: 900, name: 'desktop-large' }
    ];
    
    const results = [];
    const originalViewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    for (const bp of breakpoints) {
      console.log(`🔍 测试断点: ${bp.name} (${bp.width}x${bp.height})`);
      
      // 模拟视口变化
      Object.defineProperty(window, 'innerWidth', { value: bp.width, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: bp.height, writable: true });
      
      // 触发resize事件
      window.dispatchEvent(new Event('resize'));
      
      // 等待重新渲染
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 检测问题
      const overflowDetector = new ComponentContentOverflowDetector();
      const overflowIssues = overflowDetector.detectTextOverflow();
      const adaptiveIssues = this.detectFixedSizeUsage();
      
      if (overflowIssues.length > 0 || adaptiveIssues.length > 0) {
        results.push({
          breakpoint: bp,
          overflowIssues,
          adaptiveIssues,
          timestamp: Date.now()
        });
      }
    }
    
    // 恢复原始视口
    Object.defineProperty(window, 'innerWidth', { value: originalViewport.width, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: originalViewport.height, writable: true });
    window.dispatchEvent(new Event('resize'));
    
    return results;
  }

  /**
   * 获取相关样式信息
   */
  getRelevantStyles(element) {
    const style = getComputedStyle(element);
    return {
      display: style.display,
      width: style.width,
      height: style.height,
      minWidth: style.minWidth,
      minHeight: style.minHeight,
      maxWidth: style.maxWidth,
      maxHeight: style.maxHeight,
      fontSize: style.fontSize,
      padding: style.padding,
      margin: style.margin,
      overflow: style.overflow,
      flexShrink: style.flexShrink,
      flexGrow: style.flexGrow
    };
  }
}

// 导出检测器类
window.ComponentContentOverflowDetector = ComponentContentOverflowDetector;
window.AdaptiveLayoutFailureDetector = AdaptiveLayoutFailureDetector;

// 创建全局检测器实例
window.overflowDetector = new ComponentContentOverflowDetector();
window.adaptiveDetector = new AdaptiveLayoutFailureDetector();

console.log('🔧 组件溢出检测器已加载');
console.log('使用方法:');
console.log('• window.overflowDetector.generateDetailedReport() - 生成详细检测报告');
console.log('• window.overflowDetector.startRealTimeMonitoring() - 开始实时监控');
console.log('• window.adaptiveDetector.detectFixedSizeUsage() - 检测固定尺寸使用');
console.log('• window.adaptiveDetector.testResponsiveBreakpoints() - 测试响应式断点');