# 🛠️ 组件调试指南

## 调试方法

### 1. **完整调试页面** (推荐)
访问 `http://localhost:3000/debug` 进行完整的组件调试

**功能特点：**
- ✅ 选择不同组件（金卡、银卡、铜卡）
- ✅ 实时调整属性（尺寸、旋转、缩放等）
- ✅ 切换背景效果（WarpBackground）
- ✅ 查看当前属性JSON
- ✅ 实时预览效果

### 2. **简单调试工具**
访问 `http://localhost:3000/debug-simple` 进行单组件调试

**功能特点：**
- ✅ 浮动调试按钮
- ✅ 实时属性调整
- ✅ 属性JSON显示
- ✅ 不干扰主界面

### 3. **使用ComponentDebugger包装器**

```tsx
import ComponentDebugger from '@/components/debug/ComponentDebugger';

<ComponentDebugger
  componentName="MyComponent"
  defaultProps={{
    prop1: 'value1',
    prop2: 123
  }}
  propControls={[
    {
      key: 'prop1',
      label: '属性1',
      type: 'text'
    },
    {
      key: 'prop2',
      label: '属性2',
      type: 'range',
      min: 0,
      max: 100
    }
  ]}
>
  <MyComponent {...props} />
</ComponentDebugger>
```

## 调试技巧

### 🎯 快速调试步骤

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问调试页面**
   - 完整调试：`http://localhost:3000/debug`
   - 简单调试：`http://localhost:3000/debug-simple`

3. **调整属性**
   - 使用滑块调整数值
   - 使用下拉菜单选择选项
   - 使用复选框切换布尔值

4. **查看效果**
   - 实时预览组件变化
   - 查看属性JSON输出
   - 复制属性到实际代码

### 🔧 常用调试属性

**卡片组件：**
- `containerHeight/Width`: 容器尺寸
- `rotateAmplitude`: 旋转幅度 (0-30°)
- `scaleOnHover`: 悬停缩放 (1-2x)
- `showExpandedCard`: 显示展开卡片
- `goldCanExpand`: 允许金卡展开

**背景组件：**
- `enabled`: 启用/禁用动画
- `beamsPerSide`: 光束数量
- `beamSize`: 光束大小
- `beamDuration`: 光束持续时间

### 📱 移动端调试

在移动端访问调试页面时：
- 使用浏览器开发者工具的设备模拟
- 调整卡片尺寸适应小屏幕
- 测试触摸交互效果

### 🚀 性能调试

1. **打开浏览器开发者工具**
2. **查看Performance面板**
3. **记录动画性能**
4. **检查FPS和内存使用**

### 💡 调试建议

1. **从简单开始**：先调试单个属性
2. **逐步复杂化**：添加更多属性组合
3. **测试边界值**：最小值、最大值、异常值
4. **保存配置**：复制有用的属性组合
5. **记录问题**：记录发现的问题和解决方案

## 故障排除

### 常见问题

**Q: 组件不显示？**
A: 检查图片路径和属性值是否正确

**Q: 动画不流畅？**
A: 降低旋转幅度或缩放值

**Q: 属性不生效？**
A: 确保属性名称和类型正确

**Q: 调试面板不显示？**
A: 检查浏览器控制台是否有错误

### 获取帮助

如果遇到问题：
1. 查看浏览器控制台错误
2. 检查组件属性类型
3. 参考原始组件文档
4. 使用简单调试工具逐步测试

---

**Happy Debugging! 🎉**
