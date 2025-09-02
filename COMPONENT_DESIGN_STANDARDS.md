# 🎨 组件设计规范文档

## 📋 概述

本文档为 **星汇漫舞直播公会数据分析平台** 制定了标准化的组件设计规范，确保所有UI组件都具备优秀的自适应能力和用户体验。

**适用范围**: 所有React组件开发  
**维护团队**: 前端开发团队  
**最后更新**: 2025年9月1日  

## 🎯 设计原则

### 1. 自适应优先 (Adaptive First)
- **零固定像素值**: 禁止使用固定px值，除非有特殊技术需求
- **响应式单位**: 优先使用 `clamp()`, `vw/vh`, `rem` 等响应式单位
- **弹性布局**: 所有容器都应该能够适应内容变化

### 2. 内容完整性 (Content Integrity)
- **防止遮挡**: 确保所有内容在任何屏幕尺寸下都完全可见
- **智能截断**: 长文本使用智能截断，提供完整信息的访问方式
- **信息保真**: 重要信息不能因为布局限制而丢失

### 3. 用户体验优先 (UX First)
- **一致性**: 相似功能组件应有相似的交互方式
- **可访问性**: 遵循 WCAG 2.1 AA 标准
- **性能优化**: 组件应该轻量化，避免不必要的重渲染

## 📐 布局规范

### 容器设计规范

#### 基础容器类
```css
/* 标准自适应容器 */
.adaptive-container {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}

/* 网格自适应容器 */
.grid-adaptive {
  display: grid;
  min-width: 0;
  min-height: 0;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(0.5rem, 2vw, 1rem);
}
```

#### 尺寸定义标准
```css
/* 响应式尺寸系统 */
:root {
  /* 字体大小 */
  --text-xs: clamp(0.625rem, 1.5vw, 0.75rem);
  --text-sm: clamp(0.75rem, 1.8vw, 0.875rem);
  --text-base: clamp(0.875rem, 2vw, 1rem);
  --text-lg: clamp(1rem, 2.2vw, 1.125rem);
  --text-xl: clamp(1.125rem, 2.5vw, 1.25rem);
  
  /* 间距系统 */
  --space-xs: clamp(0.25rem, 0.5vw, 0.375rem);
  --space-sm: clamp(0.375rem, 0.75vw, 0.5rem);
  --space-base: clamp(0.5rem, 1vw, 0.75rem);
  --space-lg: clamp(0.75rem, 1.5vw, 1rem);
  --space-xl: clamp(1rem, 2vw, 1.5rem);
  
  /* 组件最小尺寸 */
  --card-min-height: clamp(8rem, 15vh, 12rem);
  --button-min-height: clamp(2rem, 4vh, 2.5rem);
  --input-min-height: clamp(2rem, 4vh, 2.5rem);
}
```

### 断点系统
```css
/* 响应式断点 */
:root {
  --bp-xs: 320px;   /* 超小屏手机 */
  --bp-sm: 480px;   /* 小屏手机 */
  --bp-md: 768px;   /* 平板 */
  --bp-lg: 1024px;  /* 小屏桌面 */
  --bp-xl: 1440px;  /* 大屏桌面 */
  --bp-xxl: 1920px; /* 超大屏 */
}

/* 媒体查询标准 */
@media (max-width: 479px) { /* 小屏手机 */ }
@media (min-width: 480px) and (max-width: 767px) { /* 大屏手机 */ }
@media (min-width: 768px) and (max-width: 1023px) { /* 平板 */ }
@media (min-width: 1024px) and (max-width: 1439px) { /* 小屏桌面 */ }
@media (min-width: 1440px) { /* 大屏桌面 */ }
```

## 📝 文本处理规范

### 文本截断标准

#### 单行截断
```css
.text-truncate-single {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
```

#### 多行截断
```css
.text-truncate-multi {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.text-truncate-2-lines { -webkit-line-clamp: 2; }
.text-truncate-3-lines { -webkit-line-clamp: 3; }
.text-truncate-4-lines { -webkit-line-clamp: 4; }
```

#### 智能换行
```css
.text-smart-wrap {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.4;
}
```

### TypeScript文本处理Hook

#### useSmartTextProcessing
```typescript
import { useCallback } from 'react';

interface TextProcessingOptions {
  maxLength?: number;
  preferWordBoundary?: boolean;
  ellipsis?: string;
  showTooltip?: boolean;
}

export const useSmartTextProcessing = () => {
  const truncateText = useCallback((
    text: string, 
    options: TextProcessingOptions = {}
  ): string => {
    const { 
      maxLength = 50, 
      preferWordBoundary = true, 
      ellipsis = '…' 
    } = options;
    
    if (!text || text.length <= maxLength) return text;
    
    let truncated = text.substring(0, maxLength - ellipsis.length);
    
    if (preferWordBoundary) {
      const boundaries = [' ', ',', '.', '，', '。', '！', '？'];
      let bestCutPoint = -1;
      
      for (let i = truncated.length - 1; i >= maxLength * 0.7; i--) {
        if (boundaries.includes(truncated[i])) {
          bestCutPoint = i;
          break;
        }
      }
      
      if (bestCutPoint > 0) {
        truncated = truncated.substring(0, bestCutPoint);
      }
    }
    
    return truncated + ellipsis;
  }, []);

  const formatNumber = useCallback((
    value: number, 
    options: { compact?: boolean; currency?: boolean } = {}
  ): string => {
    const { compact = true, currency = false } = options;
    const prefix = currency ? '¥' : '';
    
    if (!compact) return prefix + value.toLocaleString();
    
    if (value >= 100000000) return `${prefix}${(value / 100000000).toFixed(1)}亿`;
    if (value >= 10000000) return `${prefix}${(value / 10000000).toFixed(1)}千万`;
    if (value >= 1000000) return `${prefix}${(value / 10000).toFixed(0)}万`;
    if (value >= 10000) return `${prefix}${(value / 10000).toFixed(1)}万`;
    if (value >= 1000) return `${prefix}${(value / 1000).toFixed(1)}K`;
    
    return prefix + value.toString();
  }, []);

  return { truncateText, formatNumber };
};
```

## 🧩 组件架构规范

### 组件基础结构

#### 标准组件模板
```typescript
import React, { useMemo, useCallback, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useSmartTextProcessing } from '@/hooks/useSmartTextProcessing';
import { useAdaptiveContainer } from '@/hooks/useAdaptiveContainer';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  // 具体属性...
}

export const AdaptiveComponent = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, children, ...props }, ref) => {
    const { containerRef, dimensions, responsiveConfig } = useAdaptiveContainer();
    const { truncateText, formatNumber } = useSmartTextProcessing();
    
    // 智能内容处理
    const processedContent = useMemo(() => {
      // 根据容器尺寸处理内容...
      return content;
    }, [content, dimensions]);
    
    return (
      <div
        ref={ref || containerRef}
        className={cn('adaptive-container', className)}
        {...props}
      >
        {processedContent}
      </div>
    );
  }
);

AdaptiveComponent.displayName = 'AdaptiveComponent';
```

### Props设计规范

#### 必需属性
```typescript
interface RequiredProps {
  // 内容相关
  data: Array<any>;           // 数据源
  
  // 样式相关  
  className?: string;         // 自定义样式类
  style?: CSSProperties;      // 内联样式
  
  // 功能相关
  onInteraction?: () => void; // 交互回调
}
```

#### 可选属性
```typescript
interface OptionalProps {
  // 自适应配置
  enableResize?: boolean;           // 启用尺寸监听
  preventOverflow?: boolean;        // 防止溢出
  maxTextLength?: number;           // 最大文本长度
  
  // 显示配置
  showTooltip?: boolean;           // 显示工具提示
  compactMode?: boolean;           // 紧凑模式
  
  // 可访问性
  'aria-label'?: string;           // 无障碍标签
  'data-testid'?: string;          // 测试标识
}
```

## 🎨 样式编写规范

### CSS类命名规范

#### 命名约定
```css
/* 块级元素 */
.component-name { }

/* 元素 */
.component-name__element { }

/* 修饰符 */
.component-name--modifier { }
.component-name__element--modifier { }

/* 状态类 */
.is-active { }
.is-disabled { }
.has-error { }

/* 工具类 */
.u-text-center { }
.u-mb-sm { }
```

#### 示例
```css
/* ✅ 推荐 */
.ranking-table { }
.ranking-table__header { }
.ranking-table__cell { }
.ranking-table__cell--numeric { }
.ranking-table--compact { }

/* ❌ 不推荐 */
.rankingTable { }
.ranking_table_header { }
.table-cell-numeric { }
```

### 样式组织结构
```css
/* 1. 位置和尺寸 */
.component {
  position: relative;
  display: flex;
  width: 100%;
  height: clamp(3rem, 6vh, 4rem);
  min-width: 0;
  min-height: 0;
  
  /* 2. 间距 */
  margin: var(--space-base);
  padding: var(--space-sm);
  gap: var(--space-xs);
  
  /* 3. 边框和背景 */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: clamp(0.5rem, 1vw, 0.75rem);
  background: linear-gradient(135deg, ...);
  
  /* 4. 文字 */
  font-size: var(--text-base);
  font-weight: 500;
  color: #374151;
  text-align: left;
  
  /* 5. 其他 */
  overflow: hidden;
  transition: all 0.3s ease;
  transform: translateZ(0); /* 硬件加速 */
}
```

## 🔍 质量检查清单

### 开发阶段检查

#### 布局检查 ✅
- [ ] 使用了响应式单位 (clamp, vw/vh, rem)
- [ ] 避免了固定像素值
- [ ] 设置了 `min-width: 0` 在flex容器中
- [ ] 实现了防溢出机制
- [ ] 测试了极端尺寸下的显示效果

#### 文本处理检查 ✅
- [ ] 长文本有截断处理
- [ ] 提供了完整信息的访问方式 (tooltip等)
- [ ] 数值有智能格式化
- [ ] 多语言文本有适当的换行处理

#### 交互检查 ✅
- [ ] 所有交互元素都有合适的点击区域
- [ ] 悬停状态明确
- [ ] 焦点管理正确
- [ ] 键盘导航可用

#### 性能检查 ✅
- [ ] 避免了不必要的重渲染
- [ ] 大型列表使用了虚拟化
- [ ] 图片有适当的优化
- [ ] 动画使用了硬件加速

### 测试阶段检查

#### 多设备测试 ✅
- [ ] iPhone SE (375x667) - 小屏手机
- [ ] iPhone 12 (390x844) - 标准手机
- [ ] iPad Mini (768x1024) - 小平板
- [ ] iPad Pro (1024x1366) - 大平板
- [ ] Desktop (1024x768) - 小屏桌面
- [ ] Desktop (1440x900) - 标准桌面
- [ ] Desktop (1920x1080) - 大屏桌面
- [ ] Ultra Wide (2560x1440) - 超宽屏

#### 内容压力测试 ✅
- [ ] 超长文本 (50+ 字符)
- [ ] 超大数值 (1000万+)
- [ ] 极小容器 (< 200px)
- [ ] 空数据状态
- [ ] 大量数据状态

## 🛠️ 开发工具

### 自动化检测工具

#### 1. 组件溢出检测器
```bash
# 运行溢出检测
node component-overflow-detector.js

# 在浏览器中测试
open overflow-detection-test.html
```

#### 2. 自适应验证脚本
```bash
# 运行完整验证
npm run adaptive-check

# 持续集成检查
npm run ci:check
```

#### 3. 类型检查
```bash
# TypeScript检查
npm run type-check

# 编译验证
npm run build
```

### VS Code配置

#### 推荐扩展
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### 代码片段
```json
// .vscode/snippets.json
{
  "Adaptive Component": {
    "prefix": "adaptive-component",
    "body": [
      "import React, { forwardRef } from 'react';",
      "import { cn } from '@/lib/utils';",
      "import { useAdaptiveContainer } from '@/hooks/useAdaptiveContainer';",
      "",
      "interface ${1:Component}Props {",
      "  className?: string;",
      "  children?: React.ReactNode;",
      "}",
      "",
      "export const ${1:Component} = forwardRef<HTMLDivElement, ${1:Component}Props>(",
      "  ({ className, children, ...props }, ref) => {",
      "    const { containerRef } = useAdaptiveContainer();",
      "    ",
      "    return (",
      "      <div",
      "        ref={ref || containerRef}",
      "        className={cn('adaptive-container', className)}",
      "        {...props}",
      "      >",
      "        {children}",
      "      </div>",
      "    );",
      "  }",
      ");",
      "",
      "${1:Component}.displayName = '${1:Component}';"
    ]
  }
}
```

## 📚 参考资源

### 设计系统参考
- [Ant Design](https://ant.design/) - 组件库设计参考
- [Tailwind CSS](https://tailwindcss.com/) - 工具类设计系统
- [Material Design](https://material.io/) - 谷歌设计语言

### 可访问性指南
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - 网页内容可访问性指南
- [WAI-ARIA](https://www.w3.org/WAI/ARIA/) - 无障碍富互联网应用

### 性能优化
- [Web Vitals](https://web.dev/vitals/) - 网页核心性能指标
- [React Performance](https://react.dev/learn/render-and-commit) - React性能优化

## 📋 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| 1.0.0 | 2025-09-01 | 初始版本，建立基础设计规范 |

## 🤝 贡献指南

### 提交规范更新
1. Fork 本仓库
2. 创建特性分支: `git checkout -b feature/design-standard-update`
3. 提交更改: `git commit -m "feat: 更新组件设计规范"`
4. 推送分支: `git push origin feature/design-standard-update`
5. 创建 Pull Request

### 问题反馈
如果发现规范中的问题或有改进建议，请：
1. 在 Issues 中创建新议题
2. 详细描述问题或建议
3. 提供具体的使用场景
4. 附上相关的代码示例

---

**维护团队**: 前端开发团队  
**最后更新**: 2025年9月1日  
**下次审查**: 2025年12月1日