import fs from 'fs';
import path from 'path';

export interface CodeHealthIssue {
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

export interface CodeHealthReport {
  totalFiles: number;
  totalIssues: number;
  issuesByType: Record<string, number>;
  issuesBySeverity: Record<string, number>;
  issues: CodeHealthIssue[];
  score: number; // 0-100
}

export class CodeHealthChecker {
  private projectRoot: string;
  private excludePatterns: string[] = [
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    '*.min.js',
    '*.d.ts'
  ];

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  async scanProject(): Promise<CodeHealthReport> {
    const files = await this.getProjectFiles();
    const issues: CodeHealthIssue[] = [];

    for (const file of files) {
      const fileIssues = await this.scanFile(file);
      issues.push(...fileIssues);
    }

    return this.generateReport(files.length, issues);
  }

  private async getProjectFiles(): Promise<string[]> {
    const files: string[] = [];
    
    const scanDirectory = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(this.projectRoot, fullPath);
        
        // 跳过排除的文件和目录
        if (this.shouldExclude(relativePath)) continue;
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (this.isTargetFile(entry.name)) {
          files.push(fullPath);
        }
      }
    };

    scanDirectory(this.projectRoot);
    return files;
  }

  private shouldExclude(relativePath: string): boolean {
    return this.excludePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(relativePath);
      }
      return relativePath.includes(pattern);
    });
  }

  private isTargetFile(filename: string): boolean {
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    return extensions.some(ext => filename.endsWith(ext));
  }

  private async scanFile(filePath: string): Promise<CodeHealthIssue[]> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const issues: CodeHealthIssue[] = [];
    const relativePath = path.relative(this.projectRoot, filePath);

    // 性能反模式检查
    issues.push(...this.checkPerformanceAntiPatterns(content, lines, relativePath));
    
    // React 特定问题检查
    issues.push(...this.checkReactIssues(content, lines, relativePath));
    
    // 内存泄漏风险检查
    issues.push(...this.checkMemoryLeaks(content, lines, relativePath));
    
    // 代码质量检查
    issues.push(...this.checkCodeQuality(content, lines, relativePath));

    return issues;
  }

  private checkPerformanceAntiPatterns(content: string, lines: string[], file: string): CodeHealthIssue[] {
    const issues: CodeHealthIssue[] = [];

    // 检查未优化的循环渲染
    lines.forEach((line, index) => {
      // 检查 map 中的内联对象创建
      if (line.includes('.map(') && (line.includes('style={{') || line.includes('onClick={() =>'))) {
        issues.push({
          type: 'warning',
          category: '性能',
          message: 'map渲染中使用内联对象/函数，可能导致不必要的重渲染',
          file,
          line: index + 1,
          suggestion: '将内联对象/函数提取到组件外部或使用useCallback/useMemo优化',
          severity: 'medium',
          autoFixable: false
        });
      }

      // 检查未使用key的列表渲染
      if (line.includes('.map(') && !line.includes('key=')) {
        const nextLine = lines[index + 1];
        if (nextLine && !nextLine.includes('key=')) {
          issues.push({
            type: 'error',
            category: '性能',
            message: '列表渲染缺少key属性',
            file,
            line: index + 1,
            suggestion: '为每个列表项添加唯一的key属性',
            severity: 'high',
            autoFixable: true
          });
        }
      }

      // 检查频繁的DOM查询
      if (line.includes('document.querySelector') || line.includes('document.getElementById')) {
        issues.push({
          type: 'warning',
          category: '性能',
          message: '直接DOM查询可能影响性能',
          file,
          line: index + 1,
          suggestion: '使用React ref或将查询结果缓存',
          severity: 'medium',
          autoFixable: false
        });
      }

      // 检查未优化的状态更新
      if (line.includes('useState') && line.includes('[]')) {
        const stateVarMatch = line.match(/const\s+\[(\w+),\s*set\w+\]\s*=\s*useState/);
        if (stateVarMatch) {
          const stateVar = stateVarMatch[1];
          // 检查是否在后续行中有频繁更新
          const subsequentLines = lines.slice(index + 1, index + 20);
          const updateCount = subsequentLines.filter(l => l.includes(`set${stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}`)).length;
          if (updateCount > 3) {
            issues.push({
              type: 'info',
              category: '性能',
              message: `状态 ${stateVar} 可能更新过于频繁`,
              file,
              line: index + 1,
              suggestion: '考虑使用useReducer或批量更新状态',
              severity: 'low',
              autoFixable: false
            });
          }
        }
      }
    });

    // 检查大型组件
    if (lines.length > 300) {
      issues.push({
        type: 'warning',
        category: '架构',
        message: `组件过大 (${lines.length} 行)，建议拆分`,
        file,
        suggestion: '将大型组件拆分为更小的子组件',
        severity: 'medium',
        autoFixable: false
      });
    }

    return issues;
  }

  private checkReactIssues(content: string, lines: string[], file: string): CodeHealthIssue[] {
    const issues: CodeHealthIssue[] = [];

    lines.forEach((line, index) => {
      // 检查缺少依赖的useEffect
      if (line.includes('useEffect(')) {
        const effectBlock = this.extractEffectBlock(lines, index);
        const dependencies = this.extractDependencies(effectBlock);
        const usedVars = this.extractUsedVariables(effectBlock);
        
        const missingDeps = usedVars.filter(v => !dependencies.includes(v));
        if (missingDeps.length > 0) {
          issues.push({
            type: 'warning',
            category: 'React',
            message: `useEffect可能缺少依赖: ${missingDeps.join(', ')}`,
            file,
            line: index + 1,
            suggestion: '添加缺少的依赖到依赖数组中',
            severity: 'medium',
            autoFixable: true
          });
        }
      }

      // 检查未清理的副作用
      if (line.includes('setInterval') || line.includes('setTimeout') || line.includes('addEventListener')) {
        const hasCleanup = lines.slice(index, index + 10).some(l => 
          l.includes('clearInterval') || l.includes('clearTimeout') || l.includes('removeEventListener') || l.includes('return () =>')
        );
        
        if (!hasCleanup) {
          issues.push({
            type: 'error',
            category: '内存泄漏',
            message: '副作用未正确清理，可能导致内存泄漏',
            file,
            line: index + 1,
            suggestion: '在useEffect的cleanup函数中清理副作用',
            severity: 'high',
            autoFixable: false
          });
        }
      }

      // 检查直接状态变更
      if (line.includes('.push(') || line.includes('.pop(') || line.includes('.splice(')) {
        const hasStateUpdate = lines.slice(Math.max(0, index - 3), index + 3).some(l => 
          l.includes('useState') || l.includes('setState')
        );
        
        if (hasStateUpdate) {
          issues.push({
            type: 'error',
            category: 'React',
            message: '直接修改状态数组，违反React不可变性原则',
            file,
            line: index + 1,
            suggestion: '使用扩展运算符或不可变更新方法',
            severity: 'high',
            autoFixable: true
          });
        }
      }
    });

    return issues;
  }

  private checkMemoryLeaks(content: string, lines: string[], file: string): CodeHealthIssue[] {
    const issues: CodeHealthIssue[] = [];

    lines.forEach((line, index) => {
      // 检查全局变量泄漏
      if (line.includes('window.') && line.includes('=')) {
        issues.push({
          type: 'warning',
          category: '内存泄漏',
          message: '向window对象添加属性可能导致内存泄漏',
          file,
          line: index + 1,
          suggestion: '使用模块作用域变量或确保在组件卸载时清理',
          severity: 'medium',
          autoFixable: false
        });
      }

      // 检查闭包中的大对象引用
      if (line.includes('useCallback') || line.includes('useMemo')) {
        const blockContent = lines.slice(index, index + 10).join('\n');
        if (blockContent.includes('largeData') || blockContent.includes('bigObject')) {
          issues.push({
            type: 'info',
            category: '内存优化',
            message: '回调/memo中可能引用了大对象',
            file,
            line: index + 1,
            suggestion: '检查是否真的需要引用大对象，考虑只传递必要的属性',
            severity: 'low',
            autoFixable: false
          });
        }
      }
    });

    return issues;
  }

  private checkCodeQuality(content: string, lines: string[], file: string): CodeHealthIssue[] {
    const issues: CodeHealthIssue[] = [];

    lines.forEach((line, index) => {
      // 检查console.log
      if (line.includes('console.log') && !line.includes('//')) {
        issues.push({
          type: 'info',
          category: '代码质量',
          message: '生产代码中包含console.log',
          file,
          line: index + 1,
          suggestion: '移除console.log或使用适当的日志库',
          severity: 'low',
          autoFixable: true
        });
      }

      // 检查TODO注释
      if (line.includes('TODO') || line.includes('FIXME')) {
        issues.push({
          type: 'info',
          category: '代码质量',
          message: '存在未完成的TODO项',
          file,
          line: index + 1,
          suggestion: '完成TODO项或创建对应的issue',
          severity: 'low',
          autoFixable: false
        });
      }

      // 检查魔法数字
      const magicNumberRegex = /\b\d{2,}\b/g;
      const matches = line.match(magicNumberRegex);
      if (matches && !line.includes('//') && !line.includes('px') && !line.includes('ms')) {
        issues.push({
          type: 'info',
          category: '代码质量',
          message: '使用了魔法数字，建议定义为常量',
          file,
          line: index + 1,
          suggestion: '将数字提取为有意义的常量',
          severity: 'low',
          autoFixable: false
        });
      }
    });

    return issues;
  }

  private extractEffectBlock(lines: string[], startIndex: number): string {
    let braceCount = 0;
    let endIndex = startIndex;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      if (braceCount === 0 && i > startIndex) {
        endIndex = i;
        break;
      }
    }
    
    return lines.slice(startIndex, endIndex + 1).join('\n');
  }

  private extractDependencies(effectBlock: string): string[] {
    const depMatch = effectBlock.match(/\[([^\]]*)\]/);
    if (!depMatch) return [];
    
    return depMatch[1]
      .split(',')
      .map(dep => dep.trim().replace(/['"]/g, ''))
      .filter(dep => dep.length > 0);
  }

  private extractUsedVariables(effectBlock: string): string[] {
    const varRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
    const matches = effectBlock.match(varRegex) || [];
    
    // 过滤掉关键字和常见函数名
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'console', 'log'];
    return [...new Set(matches.filter(match => !keywords.includes(match)))];
  }

  private generateReport(totalFiles: number, issues: CodeHealthIssue[]): CodeHealthReport {
    const issuesByType = issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const issuesBySeverity = issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 计算健康分数 (0-100)
    const errorWeight = 10;
    const warningWeight = 5;
    const infoWeight = 1;
    
    const totalPenalty = 
      (issuesByType.error || 0) * errorWeight +
      (issuesByType.warning || 0) * warningWeight +
      (issuesByType.info || 0) * infoWeight;
    
    const maxPossiblePenalty = totalFiles * 20; // 假设每个文件最多20分扣分
    const score = Math.max(0, Math.min(100, 100 - (totalPenalty / maxPossiblePenalty) * 100));

    return {
      totalFiles,
      totalIssues: issues.length,
      issuesByType,
      issuesBySeverity,
      issues,
      score: Math.round(score)
    };
  }
}

// 使用示例
export async function runCodeHealthCheck(projectRoot: string = process.cwd()): Promise<CodeHealthReport> {
  const checker = new CodeHealthChecker(projectRoot);
  return await checker.scanProject();
}