'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Bug, 
  Zap, 
  FileText,
  TrendingUp,
  Settings,
  RefreshCw,
  Shield,
  Target
} from 'lucide-react';

interface CodeHealthIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  file: string;
  line?: number;
  column?: number;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
  autoFixable: boolean;
}

interface CodeHealthReport {
  totalFiles: number;
  totalIssues: number;
  issuesByType: Record<string, number>;
  issuesBySeverity: Record<string, number>;
  issues: CodeHealthIssue[];
  score: number;
}

export default function CodeHealthPanel() {
  const [report, setReport] = useState<CodeHealthReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [autoFixCount, setAutoFixCount] = useState(0);

  // 模拟代码健康报告数据
  const mockReport: CodeHealthReport = {
    totalFiles: 47,
    totalIssues: 23,
    issuesByType: { error: 3, warning: 12, info: 8 },
    issuesBySeverity: { high: 3, medium: 12, low: 8 },
    score: 78,
    issues: [
      {
        type: 'error',
        category: '性能',
        message: '列表渲染缺少key属性',
        file: 'components/RankingTable.tsx',
        line: 45,
        suggestion: '为每个列表项添加唯一的key属性',
        severity: 'high',
        autoFixable: true
      },
      {
        type: 'warning',
        category: '性能',
        message: 'map渲染中使用内联对象，可能导致不必要的重渲染',
        file: 'components/Top3Container.tsx',
        line: 78,
        suggestion: '将内联对象提取到组件外部或使用useMemo优化',
        severity: 'medium',
        autoFixable: false
      },
      {
        type: 'error',
        category: '内存泄漏',
        message: '副作用未正确清理，可能导致内存泄漏',
        file: 'hooks/useAnimationManager.ts',
        line: 28,
        suggestion: '在useEffect的cleanup函数中清理副作用',
        severity: 'high',
        autoFixable: false
      },
      {
        type: 'warning',
        category: 'React',
        message: 'useEffect可能缺少依赖: animationRef',
        file: 'components/GalaxyOptimized.tsx',
        line: 67,
        suggestion: '添加缺少的依赖到依赖数组中',
        severity: 'medium',
        autoFixable: true
      },
      {
        type: 'info',
        category: '代码质量',
        message: '生产代码中包含console.log',
        file: 'components/TiltedGoldCard.tsx',
        line: 188,
        suggestion: 'Remove console.log or use appropriate logging library',
        severity: 'low',
        autoFixable: true
      },
      {
        type: 'warning',
        category: '架构',
        message: '组件过大 (342 行)，建议拆分',
        file: 'components/Top3Container.tsx',
        suggestion: '将大型组件拆分为更小的子组件',
        severity: 'medium',
        autoFixable: false
      }
    ]
  };

  useEffect(() => {
    // 初始化时加载模拟数据
    setReport(mockReport);
  }, []);

  const runHealthCheck = async () => {
    setIsScanning(true);
    // 模拟扫描过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    setReport(mockReport);
    setIsScanning(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    if (score >= 40) return '需要改进';
    return '严重问题';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const filteredIssues = report?.issues.filter(issue => 
    selectedCategory === 'all' || issue.category === selectedCategory
  ) || [];

  const categories = report ? ['all', ...new Set(report.issues.map(issue => issue.category))] : ['all'];

  const autoFixIssue = (index: number) => {
    if (!report) return;
    
    const issue = filteredIssues[index];
    if (issue.autoFixable) {
      setAutoFixCount(prev => prev + 1);
      // 从报告中移除这个问题
      const newIssues = report.issues.filter(i => i !== issue);
      setReport({
        ...report,
        issues: newIssues,
        totalIssues: newIssues.length,
        score: Math.min(100, report.score + 2)
      });
    }
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">正在加载代码健康报告...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">健康分数</CardTitle>
            <Shield className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(report.score)}`}>
              {report.score}/100
            </div>
            <p className="text-xs text-slate-400">
              {getScoreStatus(report.score)}
            </p>
            <Progress 
              value={report.score} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">扫描文件</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{report.totalFiles}</div>
            <p className="text-xs text-slate-400">
              TypeScript/React 文件
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">发现问题</CardTitle>
            <Bug className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{report.totalIssues}</div>
            <p className="text-xs text-slate-400">
              {report.issuesByType.error || 0} 错误, {report.issuesByType.warning || 0} 警告
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">自动修复</CardTitle>
            <Zap className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{autoFixCount}</div>
            <p className="text-xs text-slate-400">
              已修复问题数量
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-4">
        <Button
          onClick={runHealthCheck}
          disabled={isScanning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              扫描中...
            </>
          ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              重新扫描
            </>
          )}
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-300">分类筛选:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm text-slate-200"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? '全部' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 问题列表 */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">代码问题详情</CardTitle>
          <CardDescription className="text-slate-400">
            发现的问题和修复建议 ({filteredIssues.length} 项)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIssues.map((issue, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {getIssueIcon(issue.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getSeverityBadge(issue.severity)}>
                      {issue.severity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {issue.category}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {issue.file}{issue.line && `:${issue.line}`}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 mb-2">{issue.message}</p>
                  <p className="text-xs text-slate-400 mb-3">{issue.suggestion}</p>
                  <div className="flex items-center gap-2">
                    {issue.autoFixable ? (
                      <Button
                        size="sm"
                        onClick={() => autoFixIssue(index)}
                        className="bg-green-600 hover:bg-green-700 text-xs"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        自动修复
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        disabled
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        手动修复
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-slate-400"
                    >
                      查看文件
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 统计图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">问题类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(report.issuesByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIssueIcon(type)}
                    <span className="text-sm text-slate-300 capitalize">{type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{count}</span>
                    <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(count / report.totalIssues) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">严重程度分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(report.issuesBySeverity).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 capitalize">{severity}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{count}</span>
                    <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          severity === 'high' ? 'bg-red-500' :
                          severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(count / report.totalIssues) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}