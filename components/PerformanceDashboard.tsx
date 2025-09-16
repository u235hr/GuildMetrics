'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Monitor,
  Settings,
  RefreshCw
} from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: number;
  renderTime: number;
  bundleSize: number;
  loadTime: number;
  webVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
}

interface CodeHealthIssue {
  type: 'warning' | 'error' | 'info';
  category: string;
  message: string;
  file: string;
  line?: number;
  suggestion: string;
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: { used: 45, total: 100, percentage: 45 },
    cpu: 25,
    renderTime: 16.7,
    bundleSize: 2.3,
    loadTime: 1.2,
    webVitals: { lcp: 1.8, fid: 2.1, cls: 0.05 }
  });

  const [codeHealth, setCodeHealth] = useState<CodeHealthIssue[]>([
    {
      type: 'warning',
      category: '性能',
      message: 'Galaxy组件渲染频率过高',
      file: 'components/Galaxy.tsx',
      line: 45,
      suggestion: '使用 requestAnimationFrame 优化渲染循环'
    },
    {
      type: 'info',
      category: '优化',
      message: '建议启用 React.memo 优化',
      file: 'components/Top3Container.tsx',
      line: 12,
      suggestion: '对静态组件使用 React.memo 包装'
    },
    {
      type: 'error',
      category: '内存',
      message: '检测到内存泄漏风险',
      file: 'hooks/useAnimationManager.ts',
      line: 28,
      suggestion: '确保在 useEffect cleanup 中清理定时器'
    }
  ]);

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(false);

  // 模拟实时数据更新
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        fps: Math.max(30, Math.min(60, prev.fps + (Math.random() - 0.5) * 10)),
        memory: {
          ...prev.memory,
          used: Math.max(20, Math.min(80, prev.memory.used + (Math.random() - 0.5) * 5)),
          percentage: Math.max(20, Math.min(80, prev.memory.percentage + (Math.random() - 0.5) * 5))
        },
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 15)),
        renderTime: Math.max(8, Math.min(33, prev.renderTime + (Math.random() - 0.5) * 3))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getPerformanceStatus = () => {
    if (metrics.fps >= 55 && metrics.memory.percentage < 60 && metrics.cpu < 50) {
      return { status: 'excellent', color: 'bg-green-500', text: '优秀' };
    } else if (metrics.fps >= 45 && metrics.memory.percentage < 75 && metrics.cpu < 70) {
      return { status: 'good', color: 'bg-blue-500', text: '良好' };
    } else if (metrics.fps >= 30 && metrics.memory.percentage < 85 && metrics.cpu < 85) {
      return { status: 'fair', color: 'bg-yellow-500', text: '一般' };
    } else {
      return { status: 'poor', color: 'bg-red-500', text: '需要优化' };
    }
  };

  const performanceStatus = getPerformanceStatus();

  const handleAutoOptimize = () => {
    setAutoOptimize(!autoOptimize);
    // 这里可以触发实际的优化逻辑
    if (!autoOptimize) {
      console.log('Starting intelligent performance optimization...');
      // 模拟优化效果
      setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          fps: Math.min(60, prev.fps + 10),
          memory: { ...prev.memory, percentage: Math.max(20, prev.memory.percentage - 15) },
          cpu: Math.max(10, prev.cpu - 20)
        }));
      }, 1000);
    }
  };

  const fixIssue = (index: number) => {
    setCodeHealth(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">性能监控仪表板</h1>
            <p className="text-slate-300">实时监控项目性能与代码健康状态</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge 
              className={`${performanceStatus.color} text-white px-4 py-2 text-sm font-medium`}
            >
              {performanceStatus.text}
            </Badge>
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant={isMonitoring ? "destructive" : "default"}
              size="sm"
            >
              <Monitor className="w-4 h-4 mr-2" />
              {isMonitoring ? '停止监控' : '开始监控'}
            </Button>
            <Button
              onClick={handleAutoOptimize}
              variant={autoOptimize ? "secondary" : "outline"}
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              {autoOptimize ? '优化中...' : '智能优化'}
            </Button>
          </div>
        </div>

        {/* 核心指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">帧率 (FPS)</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.fps.toFixed(0)}</div>
              <p className="text-xs text-slate-400">
                目标: 60 FPS
              </p>
              <Progress 
                value={(metrics.fps / 60) * 100} 
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">内存使用</CardTitle>
              <HardDrive className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.memory.percentage.toFixed(0)}%</div>
              <p className="text-xs text-slate-400">
                {metrics.memory.used.toFixed(1)}MB / {metrics.memory.total}MB
              </p>
              <Progress 
                value={metrics.memory.percentage} 
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">CPU 使用率</CardTitle>
              <Cpu className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.cpu.toFixed(0)}%</div>
              <p className="text-xs text-slate-400">
                渲染时间: {metrics.renderTime.toFixed(1)}ms
              </p>
              <Progress 
                value={metrics.cpu} 
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">加载性能</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.loadTime.toFixed(1)}s</div>
              <p className="text-xs text-slate-400">
                包大小: {metrics.bundleSize.toFixed(1)}MB
              </p>
              <Progress 
                value={Math.max(0, 100 - (metrics.loadTime / 5) * 100)} 
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* 详细监控 */}
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="performance" className="text-slate-200">性能监控</TabsTrigger>
            <TabsTrigger value="health" className="text-slate-200">代码健康</TabsTrigger>
            <TabsTrigger value="optimization" className="text-slate-200">优化建议</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Web Vitals</CardTitle>
                  <CardDescription className="text-slate-400">
                    核心网页指标监控
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">LCP (最大内容绘制)</span>
                    <span className="text-sm font-medium text-white">{metrics.webVitals.lcp.toFixed(1)}s</span>
                  </div>
                  <Progress value={(4 - metrics.webVitals.lcp) / 4 * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">FID (首次输入延迟)</span>
                    <span className="text-sm font-medium text-white">{metrics.webVitals.fid.toFixed(1)}ms</span>
                  </div>
                  <Progress value={(100 - metrics.webVitals.fid) / 100 * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">CLS (累积布局偏移)</span>
                    <span className="text-sm font-medium text-white">{metrics.webVitals.cls.toFixed(3)}</span>
                  </div>
                  <Progress value={(0.1 - metrics.webVitals.cls) / 0.1 * 100} className="h-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">实时性能图表</CardTitle>
                  <CardDescription className="text-slate-400">
                    性能指标趋势
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-end justify-between gap-1">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div
                        key={i}
                        className="bg-cyan-500/30 rounded-t"
                        style={{
                          height: `${Math.random() * 80 + 20}%`,
                          width: '4%'
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>20s前</span>
                    <span>现在</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">代码健康检查</CardTitle>
                <CardDescription className="text-slate-400">
                  发现的问题和建议修复方案
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {codeHealth.map((issue, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-slate-700/50">
                      <div className="flex-shrink-0">
                        {issue.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                        {issue.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                        {issue.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {issue.category}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {issue.file}{issue.line && `:${issue.line}`}
                          </span>
                        </div>
                        <p className="text-sm text-slate-200 mb-2">{issue.message}</p>
                        <p className="text-xs text-slate-400 mb-3">{issue.suggestion}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fixIssue(index)}
                          className="text-xs"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          修复
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">自动优化设置</CardTitle>
                  <CardDescription className="text-slate-400">
                    智能性能优化配置
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">WebGL 自适应渲染</span>
                    <Button size="sm" variant="outline">启用</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">动画性能限制</span>
                    <Button size="sm" variant="outline">启用</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">内存自动清理</span>
                    <Button size="sm" variant="outline">启用</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">代码分割优化</span>
                    <Button size="sm" variant="outline">启用</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">优化建议</CardTitle>
                  <CardDescription className="text-slate-400">
                    基于当前性能数据的建议
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-400">✓ Galaxy组件已优化，性能良好</p>
                  </div>
                  <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-400">→ 建议启用 React.memo 优化静态组件</p>
                  </div>
                  <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-sm text-yellow-400">⚠ 内存使用偏高，建议清理未使用的依赖</p>
                  </div>
                  <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20">
                    <p className="text-sm text-purple-400">💡 可以启用图片懒加载进一步优化</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}