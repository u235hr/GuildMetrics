module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/ranking',
        'http://localhost:3000/data-analysis'
      ],
      startServerCommand: 'npm start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
    },
    assert: {
      // 自适应和可访问性相关的断言
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        
        // 布局稳定性
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // 文本可读性
        'color-contrast': 'error',
        'font-size': 'error',
        
        // 响应式设计
        'viewport': 'error',
        'meta-viewport': 'error',
        
        // 可访问性标签
        'label': 'error',
        'heading-order': 'warn',
        'link-name': 'error',
        'button-name': 'error',
        
        // 图片可访问性
        'image-alt': 'error',
        
        // 表单可访问性
        'form-field-multiple-labels': 'error',
        'duplicate-id-aria': 'error',
        
        // 焦点管理
        'focus-traps': 'error',
        'focusable-controls': 'error',
        'interactive-element-affordance': 'error',
        
        // 语义化标记
        'bypass': 'warn',
        'document-title': 'error',
        'html-has-lang': 'error',
        'landmarks': 'warn'
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};