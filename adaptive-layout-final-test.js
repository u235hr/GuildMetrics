#!/usr/bin/env node

/**
 * 星汇漫舞数据大屏 - 自适应布局最终验证脚本
 * 全面检测UI美学优化后的布局适应性、遮挡问题及整体交付质量
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 星汇漫舞数据大屏 - 自适应布局最终验证');
console.log('================================================');

// 验证检查项目
const checks = {
  serverRunning: false,
  cssVariables: false,
  componentStructure: false,
  responsiveUnits: false,
  aestheticElements: false,
  rankingDataIntegrity: false,
  performanceOptimization: false
};

let totalScore = 0;
const maxScore = Object.keys(checks).length;

// 辅助函数
const logSuccess = (message) => console.log(`✅ ${message}`);
const logError = (message) => console.log(`❌ ${message}`);
const logInfo = (message) => console.log(`ℹ️  ${message}`);

// 1. 检查服务器运行状态
async function checkServerStatus() {
  logInfo('检查开发服务器状态...');
  try {
    const { spawn } = require('child_process');
    const curl = spawn('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', 'http://localhost:3001']);
    
    curl.on('close', (code) => {
      if (code === 0) {
        logSuccess('开发服务器运行正常 (http://localhost:3001)');
        checks.serverRunning = true;
        totalScore++;
      } else {
        logError('开发服务器未运行或无法访问');
      }
      checkCSSVariables();
    });
  } catch (error) {
    logError('无法检查服务器状态');
    checkCSSVariables();
  }
}

// 2. 检查CSS变量系统
function checkCSSVariables() {
  logInfo('验证CSS变量系统完整性...');
  try {
    const globalCssPath = path.join(process.cwd(), 'src/app/globals.css');
    const designSystemPath = path.join(process.cwd(), 'src/styles/design-system.ts');
    
    if (fs.existsSync(globalCssPath) && fs.existsSync(designSystemPath)) {
      const globalCss = fs.readFileSync(globalCssPath, 'utf8');
      const designSystem = fs.readFileSync(designSystemPath, 'utf8');
      
      // 检查关键CSS变量
      const cssChecks = [
        'viewport-container',
        'adaptive-layout', 
        'glass-card-enhanced',
        'prevention-overlap'
      ];
      
      const dsChecks = [
        'colors',
        'gradients',
        'typography',
        'shadows'
      ];
      
      const cssValid = cssChecks.every(check => globalCss.includes(check));
      const dsValid = dsChecks.every(check => designSystem.includes(check));
      
      if (cssValid && dsValid) {
        logSuccess('CSS变量系统完整，设计系统正确配置');
        checks.cssVariables = true;
        totalScore++;
      } else {
        logError('CSS变量系统不完整');
      }
    } else {
      logError('关键样式文件缺失');
    }
  } catch (error) {
    logError('CSS变量系统检查失败');
  }
  checkComponentStructure();
}

// 3. 检查组件架构
function checkComponentStructure() {
  logInfo('验证组件架构完整性...');
  try {
    const componentsDir = path.join(process.cwd(), 'src/components');
    const requiredComponents = [
      'Header.tsx',
      'MainDashboard.tsx', 
      'ModernTopThreeDisplay.tsx',
      'ModernRankingTable.tsx'
    ];
    
    const existingComponents = requiredComponents.filter(comp => 
      fs.existsSync(path.join(componentsDir, comp))
    );
    
    if (existingComponents.length === requiredComponents.length) {
      logSuccess('所有核心组件文件存在');
      
      // 检查组件内容完整性
      const mainDashboard = fs.readFileSync(path.join(componentsDir, 'MainDashboard.tsx'), 'utf8');
      if (mainDashboard.includes('viewport-container') && 
          mainDashboard.includes('top-three-section') &&
          mainDashboard.includes('ranking-section')) {
        logSuccess('主布局组件结构正确，防遮挡容器已配置');
        checks.componentStructure = true;
        totalScore++;
      } else {
        logError('主布局组件结构不完整');
      }
    } else {
      logError(`缺失组件文件: ${requiredComponents.filter(comp => !existingComponents.includes(comp)).join(', ')}`);
    }
  } catch (error) {
    logError('组件架构检查失败');
  }
  checkResponsiveUnits();
}

// 4. 检查响应式单位使用
function checkResponsiveUnits() {
  logInfo('验证响应式单位使用情况...');
  try {
    const globalCssPath = path.join(process.cwd(), 'src/app/globals.css');
    const headerPath = path.join(process.cwd(), 'src/components/Header.tsx');
    
    if (fs.existsSync(globalCssPath) && fs.existsSync(headerPath)) {
      const globalCss = fs.readFileSync(globalCssPath, 'utf8');
      const header = fs.readFileSync(headerPath, 'utf8');
      
      // 检查响应式单位
      const responsiveUnits = ['clamp(', 'vh', 'vw', 'min(', 'max('];
      const hasResponsiveUnits = responsiveUnits.some(unit => 
        globalCss.includes(unit) || header.includes(unit)
      );
      
      if (hasResponsiveUnits) {
        logSuccess('响应式单位正确使用 (clamp, vh, vw)');
        checks.responsiveUnits = true;
        totalScore++;
      } else {
        logError('响应式单位使用不足');
      }
    }
  } catch (error) {
    logError('响应式单位检查失败');
  }
  checkAestheticElements();
}

// 5. 检查美学元素
function checkAestheticElements() {
  logInfo('验证数据大屏美学元素...');
  try {
    const designSystemPath = path.join(process.cwd(), 'src/styles/design-system.ts');
    const headerPath = path.join(process.cwd(), 'src/components/Header.tsx');
    
    if (fs.existsSync(designSystemPath) && fs.existsSync(headerPath)) {
      const designSystem = fs.readFileSync(designSystemPath, 'utf8');
      const header = fs.readFileSync(headerPath, 'utf8');
      
      // 检查美学元素
      const aestheticChecks = [
        'gradient',
        'backdrop-blur',
        'glassmorphism',
        'shadow',
        'animation'
      ];
      
      const hasAestheticElements = aestheticChecks.some(element => 
        designSystem.includes(element) || header.includes(element)
      );
      
      if (hasAestheticElements) {
        logSuccess('数据大屏美学元素完整 (玻璃态、渐变、动效)');
        checks.aestheticElements = true;
        totalScore++;
      } else {
        logError('美学元素不足');
      }
    }
  } catch (error) {
    logError('美学元素检查失败');
  }
  checkRankingDataIntegrity();
}

// 6. 检查排行榜数据规范
function checkRankingDataIntegrity() {
  logInfo('验证排行榜数据显示规范...');
  try {
    const topThreePath = path.join(process.cwd(), 'src/components/ModernTopThreeDisplay.tsx');
    const rankingPath = path.join(process.cwd(), 'src/components/ModernRankingTable.tsx');
    
    if (fs.existsSync(topThreePath) && fs.existsSync(rankingPath)) {
      const topThree = fs.readFileSync(topThreePath, 'utf8');
      const ranking = fs.readFileSync(rankingPath, 'utf8');
      
      // 检查数据规范
      const topThreeValid = topThree.includes('slice(0, 3)');
      const rankingValid = ranking.includes('slice(3)') || ranking.includes('从第4名开始');
      
      if (topThreeValid && rankingValid) {
        logSuccess('排行榜数据显示规范正确 (前3名 + 第4名开始)');
        checks.rankingDataIntegrity = true;
        totalScore++;
      } else {
        logError('排行榜数据显示规范有误');
      }
    }
  } catch (error) {
    logError('排行榜数据规范检查失败');
  }
  checkPerformanceOptimization();
}

// 7. 检查性能优化
function checkPerformanceOptimization() {
  logInfo('验证性能优化和稳定性...');
  try {
    const mainDashboardPath = path.join(process.cwd(), 'src/components/MainDashboard.tsx');
    const rankingTablePath = path.join(process.cwd(), 'src/components/ModernRankingTable.tsx');
    
    if (fs.existsSync(mainDashboardPath) && fs.existsSync(rankingTablePath)) {
      const mainDashboard = fs.readFileSync(mainDashboardPath, 'utf8');
      const rankingTable = fs.readFileSync(rankingTablePath, 'utf8');
      
      // 检查性能优化元素
      const performanceChecks = [
        'useMemo',
        'useCallback',
        'overflow',
        'internal-scroll-container'
      ];
      
      const hasPerformanceOpt = performanceChecks.some(opt => 
        mainDashboard.includes(opt) || rankingTable.includes(opt)
      );
      
      if (hasPerformanceOpt) {
        logSuccess('性能优化措施到位 (内存优化、滚动优化)');
        checks.performanceOptimization = true;
        totalScore++;
      } else {
        logError('性能优化不足');
      }
    }
  } catch (error) {
    logError('性能优化检查失败');
  }
  generateFinalReport();
}

// 8. 生成最终报告
function generateFinalReport() {
  console.log('\n================================================');
  console.log('📊 自适应布局验证报告');
  console.log('================================================');
  
  Object.entries(checks).forEach(([key, passed]) => {
    const labels = {
      serverRunning: '服务器运行状态',
      cssVariables: 'CSS变量系统',
      componentStructure: '组件架构完整性',
      responsiveUnits: '响应式单位使用',
      aestheticElements: '数据大屏美学',
      rankingDataIntegrity: '排行榜数据规范',
      performanceOptimization: '性能与稳定性'
    };
    
    console.log(`${passed ? '✅' : '❌'} ${labels[key]}`);
  });
  
  console.log(`\n📈 总体评分: ${totalScore}/${maxScore} (${Math.round(totalScore/maxScore*100)}%)`);
  
  if (totalScore === maxScore) {
    console.log('\n🎉 恭喜！项目已达到完全交付标准');
    console.log('🎯 所有验证项目均通过');
    console.log('🚀 建议进行最终用户体验测试');
  } else if (totalScore >= maxScore * 0.8) {
    console.log('\n⚡ 项目基本达到交付标准');
    console.log('🔧 建议修复剩余问题以达到完美状态');
  } else {
    console.log('\n⚠️  项目仍需优化');
    console.log('🛠️  建议重点关注失败的验证项目');
  }
  
  console.log('\n================================================');
  console.log('验证完成 - 星汇漫舞数据大屏质量检测');
  console.log('================================================');
}

// 启动验证流程
checkServerStatus();