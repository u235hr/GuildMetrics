#!/usr/bin/env node

/**
 * 自动化组件溢出检测脚本
 * 在 Node.js 环境中分析组件代码，发现潜在的溢出问题
 */

const fs = require('fs');
const path = require('path');

// 项目路径配置
const PROJECT_ROOT = '/Users/hur/星汇漫舞/数据/code/streamer-dashboard';
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'src/components');
const STYLES_DIR = path.join(PROJECT_ROOT, 'src/styles');

console.log('🔍 开始分析组件代码，查找溢出风险点...\n');

// 分析结果存储
const analysisResults = {
  componentIssues: [],
  styleIssues: [],
  recommendations: [],
  timestamp: new Date().toISOString()
};

/**
 * 分析 TypeScript 组件文件
 */
function analyzeComponentFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const issues = [];

  console.log(`📄 分析组件: ${fileName}`);

  // 检查固定尺寸使用
  const fixedSizePatterns = [
    /width:\s*['"`]?\d+px['"`]?/g,
    /height:\s*['"`]?\d+px['"`]?/g,
    /fontSize:\s*['"`]?\d+px['"`]?/g,
    /padding:\s*['"`]?\d+px['"`]?/g,
    /margin:\s*['"`]?\d+px['"`]?/g,
    /w-\d+/g, // Tailwind 固定宽度
    /h-\d+/g, // Tailwind 固定高度
    /text-\w+/g // Tailwind 固定字体大小（部分）
  ];

  fixedSizePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        type: 'fixed-size-usage',
        pattern: pattern.source,
        matches: matches,
        severity: 'medium',
        description: '使用了固定尺寸，可能在不同屏幕尺寸下显示异常'
      });
    }
  });

  // 检查可能导致溢出的长文本处理
  const textOverflowRisks = [
    {
      pattern: /\.name\b/g,
      description: '主播姓名可能很长，需要溢出处理'
    },
    {
      pattern: /giftValue/g,
      description: '礼物数值可能很大，需要格式化处理'
    },
    {
      pattern: /toLocaleString\(\)/g,
      description: '数值格式化，但未考虑空间限制'
    }
  ];

  textOverflowRisks.forEach(risk => {
    const matches = content.match(risk.pattern);
    if (matches) {
      issues.push({
        type: 'text-overflow-risk',
        pattern: risk.pattern.source,
        matches: matches,
        severity: 'high',
        description: risk.description
      });
    }
  });

  // 检查缺少的自适应处理
  const adaptivePatterns = [
    {
      pattern: /clamp\(/g,
      type: 'positive',
      description: '正在使用 clamp() 函数，这是好的'
    },
    {
      pattern: /min-width:\s*0/g,
      type: 'positive',
      description: '正在使用 min-width: 0，有助于 flex 收缩'
    },
    {
      pattern: /overflow:\s*hidden/g,
      type: 'warning',
      description: '使用了 overflow: hidden，确保这是期望的行为'
    },
    {
      pattern: /text-overflow:\s*ellipsis/g,
      type: 'positive',
      description: '使用了文本省略号，这是好的'
    }
  ];

  adaptivePatterns.forEach(pattern => {
    const matches = content.match(pattern.pattern);
    if (matches) {
      issues.push({
        type: pattern.type === 'positive' ? 'good-practice' : 'adaptive-check',
        pattern: pattern.pattern.source,
        matches: matches,
        severity: pattern.type === 'positive' ? 'info' : 'medium',
        description: pattern.description
      });
    }
  });

  return {
    file: fileName,
    path: filePath,
    issues: issues,
    linesOfCode: content.split('\n').length
  };
}

/**
 * 分析 CSS 样式文件
 */
function analyzeStyleFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const issues = [];

  console.log(`🎨 分析样式: ${fileName}`);

  // 检查固定像素值
  const fixedPixelPattern = /:\s*\d+px(?!\s*\d+px)/g; // 单独的像素值
  const matches = content.match(fixedPixelPattern);
  if (matches) {
    issues.push({
      type: 'fixed-pixel-values',
      matches: matches.slice(0, 10), // 只显示前10个
      count: matches.length,
      severity: 'medium',
      description: `发现 ${matches.length} 处固定像素值`
    });
  }

  // 检查响应式特性
  const responsivePatterns = [
    {
      pattern: /clamp\(/g,
      description: '使用了 clamp() 函数'
    },
    {
      pattern: /@media/g,
      description: '使用了媒体查询'
    },
    {
      pattern: /vw|vh|%/g,
      description: '使用了相对单位'
    },
    {
      pattern: /grid-template-columns|flex/g,
      description: '使用了弹性布局'
    }
  ];

  responsivePatterns.forEach(pattern => {
    const matches = content.match(pattern.pattern);
    if (matches) {
      issues.push({
        type: 'responsive-feature',
        pattern: pattern.pattern.source,
        count: matches.length,
        severity: 'info',
        description: pattern.description
      });
    }
  });

  return {
    file: fileName,
    path: filePath,
    issues: issues,
    linesOfCode: content.split('\n').length
  };
}

/**
 * 扫描组件目录
 */
function scanComponents() {
  console.log('📁 扫描组件目录...\n');
  
  const componentFiles = fs.readdirSync(COMPONENTS_DIR)
    .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
    .filter(file => !file.includes('.test.'));

  componentFiles.forEach(file => {
    const filePath = path.join(COMPONENTS_DIR, file);
    const analysis = analyzeComponentFile(filePath);
    analysisResults.componentIssues.push(analysis);
  });
}

/**
 * 扫描样式目录
 */
function scanStyles() {
  console.log('\n🎨 扫描样式目录...\n');
  
  const styleFiles = fs.readdirSync(STYLES_DIR)
    .filter(file => file.endsWith('.css'));

  styleFiles.forEach(file => {
    const filePath = path.join(STYLES_DIR, file);
    const analysis = analyzeStyleFile(filePath);
    analysisResults.styleIssues.push(analysis);
  });
}

/**
 * 生成修复建议
 */
function generateRecommendations() {
  console.log('\n💡 生成修复建议...\n');

  const recommendations = [];

  // 分析组件问题
  analysisResults.componentIssues.forEach(component => {
    const highRiskIssues = component.issues.filter(issue => issue.severity === 'high');
    const mediumRiskIssues = component.issues.filter(issue => issue.severity === 'medium');

    if (highRiskIssues.length > 0) {
      recommendations.push({
        priority: 'high',
        component: component.file,
        type: 'text-overflow-handling',
        description: `${component.file} 需要添加文本溢出处理`,
        details: highRiskIssues.map(issue => issue.description),
        actions: [
          '为长文本添加 text-overflow: ellipsis',
          '实现智能文本截断函数',
          '添加 title 属性显示完整内容',
          '考虑使用响应式字体大小'
        ]
      });
    }

    if (mediumRiskIssues.length > 0) {
      recommendations.push({
        priority: 'medium',
        component: component.file,
        type: 'responsive-sizing',
        description: `${component.file} 需要优化响应式尺寸`,
        details: mediumRiskIssues.map(issue => issue.description),
        actions: [
          '将固定像素值替换为 clamp() 函数',
          '使用相对单位如 rem、vw、vh',
          '添加 min-width: 0 到 flex 容器',
          '实现断点特定的样式调整'
        ]
      });
    }
  });

  // 分析样式问题
  analysisResults.styleIssues.forEach(style => {
    const fixedPixelIssues = style.issues.filter(issue => issue.type === 'fixed-pixel-values');
    
    if (fixedPixelIssues.length > 0) {
      recommendations.push({
        priority: 'medium',
        component: style.file,
        type: 'css-responsiveness',
        description: `${style.file} 包含大量固定像素值`,
        details: [`发现 ${fixedPixelIssues[0].count} 处固定像素值`],
        actions: [
          '审查所有固定像素值的必要性',
          '将关键尺寸转换为 clamp() 函数',
          '增加更多媒体查询断点',
          '优化移动端适配'
        ]
      });
    }
  });

  analysisResults.recommendations = recommendations;
}

/**
 * 生成分析报告
 */
function generateReport() {
  console.log('📊 生成分析报告...\n');

  const report = {
    summary: {
      totalComponents: analysisResults.componentIssues.length,
      totalStyles: analysisResults.styleIssues.length,
      highPriorityIssues: analysisResults.recommendations.filter(r => r.priority === 'high').length,
      mediumPriorityIssues: analysisResults.recommendations.filter(r => r.priority === 'medium').length,
      timestamp: analysisResults.timestamp
    },
    details: analysisResults
  };

  // 控制台输出
  console.log('📋 === 组件溢出风险分析报告 ===');
  console.log(`📅 分析时间: ${new Date(report.summary.timestamp).toLocaleString()}`);
  console.log(`📁 分析组件: ${report.summary.totalComponents} 个`);
  console.log(`🎨 分析样式: ${report.summary.totalStyles} 个`);
  console.log(`🚨 高优先级问题: ${report.summary.highPriorityIssues} 个`);
  console.log(`⚠️  中优先级问题: ${report.summary.mediumPriorityIssues} 个\n`);

  // 详细问题列表
  if (analysisResults.recommendations.length > 0) {
    console.log('🔧 === 修复建议 ===');
    analysisResults.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.description}`);
      console.log(`   组件: ${rec.component}`);
      console.log(`   类型: ${rec.type}`);
      rec.actions.forEach(action => {
        console.log(`   • ${action}`);
      });
      console.log('');
    });
  }

  // 保存报告到文件
  const reportPath = path.join(PROJECT_ROOT, `overflow-analysis-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`💾 详细报告已保存到: ${reportPath}\n`);

  return report;
}

/**
 * 重点分析特定组件
 */
function analyzeSpecificComponents() {
  console.log('🎯 === 重点组件分析 ===\n');

  const targetComponents = [
    'ModernTopThreeDisplay.tsx',
    'ModernRankingTable.tsx'
  ];

  targetComponents.forEach(componentName => {
    console.log(`🔍 详细分析: ${componentName}`);
    
    const componentPath = path.join(COMPONENTS_DIR, componentName);
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');
      
      // 查找潜在的溢出风险点
      const riskPatterns = [
        {
          name: '长文本处理',
          pattern: /streamer\.name|\.name\b/g,
          risk: '主播姓名可能很长，需要截断处理'
        },
        {
          name: '数值显示',
          pattern: /giftValue|\.toLocaleString\(\)/g,
          risk: '礼物数值可能很大，需要智能格式化'
        },
        {
          name: '固定尺寸',
          pattern: /\d+px|w-\d+|h-\d+/g,
          risk: '使用了固定尺寸，可能不适应小屏幕'
        },
        {
          name: 'Flex布局',
          pattern: /flex|grid/g,
          risk: '需要确保正确的收缩和溢出处理'
        }
      ];

      riskPatterns.forEach(risk => {
        const matches = content.match(risk.pattern);
        if (matches) {
          console.log(`   ⚠️  ${risk.name}: 发现 ${matches.length} 处 - ${risk.risk}`);
        }
      });

      // 检查是否有溢出处理
      const goodPractices = [
        {
          name: '省略号处理',
          pattern: /ellipsis|text-overflow/g
        },
        {
          name: '响应式尺寸',
          pattern: /clamp\(|vw|vh|rem/g
        },
        {
          name: '最小宽度设置',
          pattern: /min-width:\s*0/g
        }
      ];

      console.log('   ✅ 良好实践:');
      goodPractices.forEach(practice => {
        const matches = content.match(practice.pattern);
        if (matches) {
          console.log(`      • ${practice.name}: ${matches.length} 处`);
        } else {
          console.log(`      ❌ 缺少 ${practice.name}`);
        }
      });

    } else {
      console.log(`   ❌ 文件不存在: ${componentPath}`);
    }
    console.log('');
  });
}

// 执行分析
async function main() {
  try {
    scanComponents();
    scanStyles();
    generateRecommendations();
    const report = generateReport();
    analyzeSpecificComponents();
    
    console.log('✅ 分析完成！');
    
    // 返回分析结果供后续使用
    return report;
    
  } catch (error) {
    console.error('❌ 分析过程中出现错误:', error);
    process.exit(1);
  }
}

// 运行分析
if (require.main === module) {
  main();
}

module.exports = { main, analysisResults };