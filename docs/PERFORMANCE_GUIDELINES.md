# 开发环境性能管理规范

## 📋 性能标准

### 🎯 目标性能指标
- **FPS**: 稳定在60-120fps之间
- **内存使用**: 不超过150MB
- **帧时间**: 保持在16.7ms以下(60fps)
- **编译时间**: 不超过500ms
- **GET请求响应**: 不超过100ms

### ⚠️ 性能警告阈值
- **FPS低于30**: 严重性能问题
- **内存超过200MB**: 内存泄漏风险
- **帧时间超过33ms**: 用户体验下降
- **编译时间超过1秒**: 开发效率影响

## 🔧 性能优化检查清单

### ✅ 代码质量检查
- [ ] 避免在render函数中创建内联对象
- [ ] 使用React.memo包装纯组件
- [ ] 正确使用useMemo和useCallback
- [ ] 列表渲染必须添加key属性
- [ ] 及时清理useEffect中的副作用
- [ ] 避免在console.log中使用中文字符

### ✅ WebGL/Canvas优化
- [ ] 实现可视区域剔除(Frustum Culling)
- [ ] 使用LOD(Level of Detail)渲染
- [ ] 正确清理WebGL上下文和资源
- [ ] 避免频繁的GPU状态切换
- [ ] 使用requestAnimationFrame进行动画

### ✅ 动画系统优化
- [ ] 使用统一的动画管理器
- [ ] 避免多重requestAnimationFrame
- [ ] 实现动画池和批量处理
- [ ] 使用CSS transform代替position变化
- [ ] 合理设置动画帧率限制

## 🛠️ 自动化检查工具

### 性能监控命令
```bash
# 启动性能监控
npm run dev

# 分析打包体积
npm run analyze

# 代码健康检查
npm run health-check

# 性能基准测试
npm run benchmark
```

### 开发环境配置
```javascript
// next.config.js 性能优化配置
const nextConfig = {
  // 启用SWC编译器
  swcMinify: true,
  
  // 代码分割优化
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  },
  
  // 生产环境移除console.log
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}
```

## 📊 性能监控仪表板

### 实时监控指标
- **FPS监控**: 实时显示当前帧率和平均帧率
- **内存监控**: 显示堆内存使用情况
- **3D效果监控**: WebGL渲染性能和摆动角度
- **动画性能**: 动画执行时间和完成率

### 访问方式
- 开发环境: 右上角性能监控器
- 详细报告: http://localhost:3000/performance
- 代码健康: http://localhost:3000/health

## 🚨 故障排除指南

### 常见性能问题

#### 1. FPS突然下降
**症状**: FPS从60+降到1-10
**原因**: 
- ByteString编码错误(中文字符)
- 内存泄漏导致GC频繁
- WebGL上下文丢失

**解决方案**:
```javascript
// 检查中文字符
grep -r "[\u4e00-\u9fa5]" components/

// 清理WebGL资源
useEffect(() => {
  return () => {
    if (renderer) {
      renderer.dispose();
    }
  };
}, []);
```

#### 2. 内存持续增长
**症状**: 内存使用超过200MB且持续增长
**原因**:
- 事件监听器未清理
- 定时器未清除
- WebGL纹理未释放

**解决方案**:
```javascript
// 正确清理副作用
useEffect(() => {
  const timer = setInterval(callback, 1000);
  const listener = () => {};
  window.addEventListener('resize', listener);
  
  return () => {
    clearInterval(timer);
    window.removeEventListener('resize', listener);
  };
}, []);
```

#### 3. 编译时间过长
**症状**: 热重载超过1秒
**原因**:
- TypeScript类型检查耗时
- 大量依赖重新编译
- 缺少缓存优化

**解决方案**:
```bash
# 清理缓存
rm -rf .next node_modules/.cache

# 重新安装依赖
npm ci

# 检查TypeScript配置
npx tsc --noEmit
```

## 📈 性能基准测试

### 基准指标(MacBook Pro M1)
- **冷启动**: < 2秒
- **热重载**: < 300ms
- **页面切换**: < 100ms
- **动画流畅度**: 60fps
- **内存占用**: < 100MB

### 测试命令
```bash
# 启动基准测试
npm run benchmark

# 生成性能报告
npm run perf-report

# 对比历史数据
npm run perf-compare
```

## 🔄 持续优化流程

### 每日检查
1. 启动开发服务器，观察启动时间
2. 检查右上角性能监控器指标
3. 运行一次完整的用户流程测试
4. 查看控制台是否有性能警告

### 每周检查
1. 运行`npm run analyze`检查打包体积
2. 执行`npm run health-check`代码健康检查
3. 更新性能基准数据
4. 清理无用的依赖和代码

### 发布前检查
1. 完整的性能基准测试
2. 生产环境构建测试
3. 内存泄漏检测
4. 移动端性能测试

---

## 📞 技术支持

如遇到性能问题，请按以下步骤操作：

1. **收集信息**: 截图性能监控数据
2. **检查日志**: 查看控制台错误信息
3. **运行诊断**: 执行`npm run health-check`
4. **提供环境**: 操作系统、浏览器版本等

**联系方式**: 开发团队 - 性能优化专组