#!/usr/bin/env node

/**
 * 性能自动检查脚本
 * 用于CI/CD流程中的性能监控
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 性能阈值配置
const PERFORMANCE_THRESHOLDS = {
  maxBundleSize: 5 * 1024 * 1024, // 5MB
  maxMemoryUsage: 150 * 1024 * 1024, // 150MB
  minFPS: 30,
  maxFrameTime: 33, // 33ms for 30fps
  maxCompileTime: 1000 // 1s
};

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检查打包体积
function checkBundleSize() {
  log('\n📦 Checking bundle size...', 'blue');
  
  try {
    // 构建项目
    execSync('npm run build', { stdio: 'pipe' });
    
    // 检查.next目录大小
    const buildPath = path.join(process.cwd(), '.next');
    const stats = execSync(`du -sb ${buildPath}`).toString();
    const size = parseInt(stats.split('\t')[0]);
    
    if (size > PERFORMANCE_THRESHOLDS.maxBundleSize) {
      log(`❌ Bundle size too large: ${(size / 1024 / 1024).toFixed(2)}MB (max: ${PERFORMANCE_THRESHOLDS.maxBundleSize / 1024 / 1024}MB)`, 'red');
      return false;
    } else {
      log(`✅ Bundle size OK: ${(size / 1024 / 1024).toFixed(2)}MB`, 'green');
      return true;
    }
  } catch (error) {
    log(`❌ Build failed: ${error.message}`, 'red');
    return false;
  }
}

// 检查TypeScript类型
function checkTypeScript() {
  log('\n🔍 Checking TypeScript types...', 'blue');
  
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    log('✅ TypeScript types OK', 'green');
    return true;
  } catch (error) {
    log('❌ TypeScript type errors found', 'red');
    console.log(error.stdout?.toString() || error.message);
    return false;
  }
}

// 检查中文字符
function checkChineseCharacters() {
  log('\n🈶 Checking for Chinese characters in console.log...', 'blue');
  
  try {
    const result = execSync('grep -r "console\\.(log|warn|error|info).*[\\u4e00-\\u9fa5]" components/ app/ utils/ hooks/ 2>/dev/null || true').toString();
    
    if (result.trim()) {
      log('❌ Chinese characters found in console statements:', 'red');
      console.log(result);
      log('Please replace Chinese characters with English to avoid ByteString errors', 'yellow');
      return false;
    } else {
      log('✅ No Chinese characters in console statements', 'green');
      return true;
    }
  } catch (error) {
    log('⚠️  Could not check Chinese characters', 'yellow');
    return true;
  }
}

// 检查性能反模式
function checkPerformanceAntiPatterns() {
  log('\n⚡ Checking for performance anti-patterns...', 'blue');
  
  const issues = [];
  
  // 检查内联对象创建
  try {
    const inlineObjects = execSync('grep -r "style={{" components/ app/ 2>/dev/null || true').toString();
    if (inlineObjects.trim()) {
      issues.push('Inline style objects found (use CSS classes instead)');
    }
  } catch (e) {}
  
  // 检查缺少key的列表
  try {
    const missingKeys = execSync('grep -r "\\.map(" components/ app/ | grep -v "key=" 2>/dev/null || true').toString();
    if (missingKeys.trim()) {
      issues.push('Array.map() without key prop found');
    }
  } catch (e) {}
  
  // 检查未清理的useEffect
  try {
    const unclearedEffects = execSync('grep -r "useEffect" components/ app/ | grep -v "return" 2>/dev/null || true').toString();
    const effectCount = (unclearedEffects.match(/useEffect/g) || []).length;
    const returnCount = (unclearedEffects.match(/return/g) || []).length;
    
    if (effectCount > returnCount * 1.5) {
      issues.push('Potential uncleared useEffect hooks found');
    }
  } catch (e) {}
  
  if (issues.length > 0) {
    log('❌ Performance anti-patterns found:', 'red');
    issues.forEach(issue => log(`  - ${issue}`, 'red'));
    return false;
  } else {
    log('✅ No performance anti-patterns detected', 'green');
    return true;
  }
}

// 生成性能报告
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    results,
    summary: {
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => r.passed === false).length,
      total: results.length
    }
  };
  
  // 保存报告
  const reportPath = path.join(process.cwd(), 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`\n📊 Performance report saved to: ${reportPath}`, 'blue');
  
  return report;
}

// 主函数
async function main() {
  log('🚀 Starting performance check...', 'blue');
  
  const results = [
    { name: 'Bundle Size', passed: checkBundleSize() },
    { name: 'TypeScript Types', passed: checkTypeScript() },
    { name: 'Chinese Characters', passed: checkChineseCharacters() },
    { name: 'Performance Anti-patterns', passed: checkPerformanceAntiPatterns() }
  ];
  
  const report = generateReport(results);
  
  // 输出总结
  log('\n📋 Performance Check Summary:', 'blue');
  log(`✅ Passed: ${report.summary.passed}`, 'green');
  log(`❌ Failed: ${report.summary.failed}`, 'red');
  log(`📊 Total: ${report.summary.total}`, 'blue');
  
  // 退出码
  const exitCode = report.summary.failed > 0 ? 1 : 0;
  
  if (exitCode === 0) {
    log('\n🎉 All performance checks passed!', 'green');
  } else {
    log('\n💥 Some performance checks failed. Please fix the issues above.', 'red');
  }
  
  process.exit(exitCode);
}

// 运行检查
if (require.main === module) {
  main().catch(error => {
    log(`💥 Performance check failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { main, PERFORMANCE_THRESHOLDS };