# 技术栈升级方案：Next.js 15+ & React 19+ 与 Ant Design 移除

## 1. 概述

本方案旨在将 GuildMetrics 项目从当前的技术栈升级到 Next.js 15+ 和 React 19+，并完全移除 Ant Design 依赖，使用纯 Tailwind CSS 实现所有组件。升级后项目将符合设计规范中要求的全 Tailwind CSS 实现。

## 2. 当前技术栈分析

### 2.1. 依赖版本
- Next.js: ^15.0.0
- React: ^19.0.0
- Ant Design: ^5.27.2 (计划移除)
- @ant-design/icons: ^6.0.1 (计划移除)

### 2.2. Ant Design 使用情况
项目中以下文件使用了 Ant Design 组件：
1. `src/app/AppProviders.tsx` - ConfigProvider, theme, App
2. `src/lib/AntdRegistry.tsx` - Ant Design CSS-in-JS registry
3. `src/components/DataImport.tsx` - Upload, Button, Card, Progress, Alert, List, Modal, Space
4. `src/components/StorageManager.tsx` - Card, Button, Modal, List, Progress, Statistic, Row, Col, message, Popconfirm, Typography, Space, Alert, Divider
5. `src/components/DataExport.tsx` - Button, Dropdown, message
6. `src/components/Charts/index.tsx` - Card, Row, Col, Spin, Empty, Typography
7. `src/components/Charts/MonthOverMonthCharts.tsx` - Card, Empty
8. `src/components/MainDashboard.tsx` - Layout
9. `src/components/MonthOverMonthAnalysis.tsx` - Card, Table, Tag, Empty
10. `src/components/QualificationSettings.tsx` - Card, InputNumber, Typography, Tooltip
11. `src/components/StatisticsCards.tsx` - Card, Col, Row, Skeleton
12. `src/app/data-analysis/page.tsx` - Layout, Typography, Breadcrumb, Row, Col
13. `src/app/data-import/page.tsx` - Layout, Typography, Breadcrumb
14. `src/app/ranking/page.tsx` - Layout, Typography, Breadcrumb
15. `src/test/StatisticsCards.test.tsx` - ConfigProvider

### 2.3. 已符合要求的组件
以下组件已经使用纯 Tailwind CSS 实现，无需重构：
1. `src/components/Header.tsx`
2. `src/components/TopThreeDisplay.tsx`
3. `src/components/RankingTable.tsx`

## 3. 升级方案

### 3.1. 依赖升级
1. 升级 Next.js 到 15+ 版本
2. 升级 React 和 React DOM 到 19+ 版本
3. 移除 Ant Design 相关依赖：
   - antd
   - @ant-design/icons
   - @ant-design/cssinjs

### 3.1.1. Next.js 15 特性适配
1. 启用 Turbopack 构建系统（如果需要）
2. 适配 React 19 新特性如 useActionState、useOptimistic 等
3. 更新 App Router 相关配置

### 3.2. 组件重构计划
将使用 Ant Design 的组件重构为纯 Tailwind CSS 实现：

| 组件文件 | Ant Design 组件 | 替代方案 |
|---------|----------------|---------|
| DataImport.tsx | Upload, Card, Button, Progress, Alert, List, Modal | 自定义拖拽上传、卡片样式、进度条、警告框、列表、模态框 |
| StorageManager.tsx | Card, Button, Modal, List, Progress, Statistic, Row, Col | 自定义卡片、按钮、模态框、列表、进度条、统计数字、网格布局 |
| DataExport.tsx | Button, Dropdown | 自定义按钮、下拉菜单 |
| Charts/index.tsx | Card, Row, Col, Spin, Empty | 自定义卡片、网格布局、加载动画、空状态 |
| Charts/MonthOverMonthCharts.tsx | Card, Empty | 自定义卡片、空状态 |
| MainDashboard.tsx | Layout | 自定义布局 |
| MonthOverMonthAnalysis.tsx | Card, Table, Tag, Empty | 自定义卡片、表格、标签、空状态 |
| QualificationSettings.tsx | Card, InputNumber, Typography, Tooltip | 自定义卡片、数字输入框、排版、工具提示 |
| StatisticsCards.tsx | Card, Col, Row, Skeleton | 自定义卡片、网格布局、骨架屏 |
| 页面文件 | Layout, Typography, Breadcrumb | 自定义布局、排版、面包屑 |

### 3.2.1. DataImport 组件重构细节
1. 替换 Upload 组件为原生文件上传实现
2. 替换 Card 组件为 Tailwind CSS 卡片样式
3. 替换 Button 组件为自定义按钮样式
4. 替换 Progress 组件为自定义进度条
5. 替换 Alert 组件为自定义警告框
6. 替换 List 组件为原生 HTML 列表
7. 替换 Modal 组件为自定义模态框

### 3.2.2. StorageManager 组件重构细节
1. 替换 Card 组件为 Tailwind CSS 卡片样式
2. 替换 Button 组件为自定义按钮样式
3. 替换 Modal 组件为自定义模态框
4. 替换 List 组件为原生 HTML 列表
5. 替换 Progress 组件为自定义进度条
6. 替换 Statistic 组件为自定义统计数字展示
7. 替换 Row/Col 组件为 Tailwind CSS 网格布局
8. 替换 message 组件为自定义消息提示
9. 替换 Popconfirm 组件为自定义确认框
10. 替换 Typography 组件为原生 HTML 元素
11. 替换 Space 组件为 Tailwind CSS 间距类
12. 替换 Alert 组件为自定义警告框
13. 替换 Divider 组件为自定义分隔线

### 3.3. 配置调整
1. 移除 `src/lib/AntdRegistry.tsx` 文件
2. 修改 `src/app/AppProviders.tsx`，移除 Ant Design 的 ConfigProvider
3. 更新全局样式，移除 Ant Design 相关样式

### 3.3.1. AppProviders 调整
1. 移除 Ant Design 的 ConfigProvider 和 theme 配置
2. 移除 AntApp 组件包装
3. 保留必要的应用级配置（如 Zustand 状态管理）

### 3.3.2. 全局样式清理
1. 检查并移除 Ant Design 相关的全局样式覆盖
2. 确保 Tailwind CSS 样式正常工作
3. 验证自定义组件样式不受影响

### 3.4. 测试验证
1. 确保所有页面和功能正常运行
2. 验证响应式设计和自适应布局
3. 测试所有交互功能（上传、导出、导入、删除等）
4. 验证状态管理和数据持久化功能

### 3.4.1. 功能测试清单
1. 首页排行榜展示功能
2. 数据导入功能（MD 文件上传和解析）
3. 数据导出功能（Excel/图片导出）
4. 存储管理功能（数据清理、备份导入/导出）
5. 月度环比分析功能
6. 页面导航和状态切换
7. 主题和样式一致性

### 3.4.2. 兼容性测试
1. 不同浏览器兼容性（Chrome, Firefox, Safari, Edge）
2. 不同设备尺寸适配（桌面、平板、手机）
3. 不同分辨率下的布局表现

## 4. 实施步骤

### 4.1. 准备阶段
1. 备份当前项目代码
2. 创建新的分支进行升级工作
3. 记录当前依赖版本和功能状态

### 4.2. 依赖升级
1. 更新 package.json 中的 Next.js 和 React 版本
2. 移除 Ant Design 相关依赖
3. 安装必要的替代依赖（如果需要）

### 4.3. 组件重构
按照优先级顺序重构组件：
1. DataImport.tsx
2. StorageManager.tsx
3. DataExport.tsx
4. Charts 相关组件
5. 页面组件（data-analysis, data-import, ranking）

### 4.4. 配置清理
1. 移除 Ant Design 相关配置文件
2. 更新 AppProviders
3. 清理全局样式

### 4.5. 测试验证
1. 运行项目确保能正常启动
2. 逐一测试各页面功能
3. 验证 UI 样式符合设计规范
4. 进行响应式测试

## 5. 风险与缓解措施

### 5.1. 技术风险
- Next.js 15 和 React 19 的新特性可能导致兼容性问题
- 移除 Ant Design 后部分功能需要重新实现

### 5.2. 缓解措施
- 详细测试每个功能点
- 逐步升级，确保每步都能正常运行
- 保留原代码作为参考

## 6. 验收标准

1. 项目能成功编译和运行
2. 所有功能保持原有行为
3. UI 样式符合设计规范
4. 无 Ant Design 相关代码
5. 项目完全基于 Tailwind CSS 实现

### 5.1. 设计规范更新
升级完成后，需要更新 `/设计规范.md` 文件，确保其反映最新的技术栈和实现方式。

### 6.1. 代码质量标准
1. 符合设计规范中定义的容器自适应原则
2. 使用容器查询单位（cqw/cqh）作为字体基准
3. 使用 em 单位实现组件内部尺寸和间距的等比缩放
4. 无固定像素单位（px）的使用
5. 无内联样式
6. 无元素溢出容器边界的情况

### 6.2. 性能标准
1. 页面加载时间不超过 2 秒
2. 首次内容绘制（FCP）时间不超过 1.5 秒
3. 最大内容绘制（LCP）时间不超过 2.5 秒
4. 累积布局偏移（CLS）小于 0.1
5. JavaScript 执行时间不超过 1 秒

## 7. 总结

本次技术栈升级将使 GuildMetrics 项目现代化，采用最新的 Next.js 15+ 和 React 19+ 技术栈，同时完全移除 Ant Design 依赖，实现全 Tailwind CSS 的组件设计。这将带来以下好处：

1. **性能提升**：使用最新的框架版本和构建工具
2. **一致性**：统一使用 Tailwind CSS 实现所有组件样式
3. **可维护性**：减少依赖项，简化项目结构
4. **符合规范**：完全符合设计规范中定义的容器自适应原则
5. **未来兼容性**：为后续功能开发和技术升级奠定基础

升级完成后，项目将更加现代化、高效且易于维护，同时保持原有的功能和用户体验。