#!/usr/bin/env node

/**
 * 自适应布局验证脚本
 * 自动检查代码是否符合自适应布局要求
 */

const fs = require('fs');
const path = require('path');

class AdaptiveLayoutValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    this.srcDir = path.join(__dirname, 'src');
  }

  // 验证CSS文件
  validateCSS(filePath, content) {
    const fileName = path.basename(filePath);
    console.log(`\n🔍 验证CSS文件: ${fileName}`);

    // 1. 检查固定px值（排除0px、1px边框和特殊情况）
    const fixedPxPattern = /(?<!\b[01])\d+px(?!\s*(?:solid|dashed|dotted|border|outline))/g;
    const fixedPxMatches = content.match(fixedPxPattern);
    if (fixedPxMatches) {
      this.errors.push(`❌ ${fileName}: 发现固定px值: ${fixedPxMatches.join(', ')}`);
    } else {
      this.passed.push(`✅ ${fileName}: 未使用固定px值`);
    }

    // 2. 检查是否使用相对单位
    const relativeUnitsPattern = /(\d+(?:\.\d+)?(?:vh|vw|%|rem|em|fr))/g;
    const relativeMatches = content.match(relativeUnitsPattern);
    if (relativeMatches) {
      this.passed.push(`✅ ${fileName}: 使用相对单位: ${relativeMatches.slice(0, 3).join(', ')}${relativeMatches.length > 3 ? '...' : ''}`);
    } else {
      this.warnings.push(`⚠️ ${fileName}: 未发现相对单位使用`);
    }

    // 3. 检查clamp使用
    const clampPattern = /clamp\s*\(\s*[^,]+,\s*[^,]+,\s*[^)]+\)/g;
    const clampMatches = content.match(clampPattern);
    if (clampMatches) {
      this.passed.push(`✅ ${fileName}: 使用clamp函数: ${clampMatches.length}处`);
    }

    // 4. 检查CSS Grid使用
    const gridPattern = /display:\s*grid|grid-template/g;
    const gridMatches = content.match(gridPattern);
    if (gridMatches) {
      this.passed.push(`✅ ${fileName}: 使用CSS Grid: ${gridMatches.length}处`);
    }

    // 5. 检查Flexbox使用
    const flexPattern = /display:\s*flex|flex:\s*\d/g;
    const flexMatches = content.match(flexPattern);
    if (flexMatches) {
      this.passed.push(`✅ ${fileName}: 使用Flexbox: ${flexMatches.length}处`);
    }

    // 6. 检查overflow设置
    const overflowPattern = /overflow(-[xy])?:\s*auto/g;
    const overflowMatches = content.match(overflowPattern);
    if (overflowMatches) {
      this.passed.push(`✅ ${fileName}: 设置overflow auto: ${overflowMatches.length}处`);
    }

    // 7. 检查position absolute（可能导致重叠）
    const absolutePattern = /position:\s*absolute/g;
    const absoluteMatches = content.match(absolutePattern);
    if (absoluteMatches) {
      this.warnings.push(`⚠️ ${fileName}: 使用position absolute: ${absoluteMatches.length}处 - 请确保不会导致重叠`);
    }
  }

  // 验证React/TSX文件
  validateReact(filePath, content) {
    const fileName = path.basename(filePath);
    console.log(`\n🔍 验证React文件: ${fileName}`);

    // 1. 检查内联样式中的固定px值
    const inlineStylePattern = /style\s*=\s*\{\{[^}]+\}\}/g;
    const inlineStyles = content.match(inlineStylePattern);
    if (inlineStyles) {
      inlineStyles.forEach(style => {
        const fixedPx = style.match(/\d+px/g);
        if (fixedPx) {
          this.errors.push(`❌ ${fileName}: 内联样式中发现固定px值: ${fixedPx.join(', ')}`);
        }
      });
    }

    // 2. 检查className中是否使用了响应式类
    const responsiveClasses = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];
    const hasResponsiveClasses = responsiveClasses.some(cls => content.includes(cls));
    if (hasResponsiveClasses) {
      this.passed.push(`✅ ${fileName}: 使用响应式CSS类`);
    }

    // 3. 检查useResponsive hook使用
    if (content.includes('useResponsive')) {
      this.passed.push(`✅ ${fileName}: 使用useResponsive hook`);
    }

    // 4. 检查Grid/Flex相关的className
    const gridFlexClasses = ['grid', 'flex', 'grid-cols', 'flex-col', 'flex-row'];
    const hasGridFlex = gridFlexClasses.some(cls => content.includes(cls));
    if (hasGridFlex) {
      this.passed.push(`✅ ${fileName}: 使用Grid/Flex布局类`);
    }
  }

  // 验证特定的布局文件
  validateLayoutFiles() {
    console.log('\n🎯 验证关键布局文件...');

    // 检查排行榜页面
    const rankingPagePath = path.join(this.srcDir, 'app/ranking/page.tsx');
    if (fs.existsSync(rankingPagePath)) {
      const content = fs.readFileSync(rankingPagePath, 'utf8');
      
      // 检查是否有三段式布局结构
      if (content.includes('TopThreeDisplay') && content.includes('RankingTable')) {
        this.passed.push('✅ ranking/page.tsx: 包含前三名展示和排行榜组件');
      } else {
        this.errors.push('❌ ranking/page.tsx: 缺少必要的布局组件');
      }

      // 检查是否使用了Grid布局
      if (content.includes('grid') || content.includes('Grid')) {
        this.passed.push('✅ ranking/page.tsx: 使用Grid布局');
      } else {
        this.warnings.push('⚠️ ranking/page.tsx: 未明确使用Grid布局');
      }
    }

    // 检查TopThreeDisplay组件
    const topThreePath = path.join(this.srcDir, 'components/TopThreeDisplay.tsx');
    if (fs.existsSync(topThreePath)) {
      const content = fs.readFileSync(topThreePath, 'utf8');
      
      if (content.includes('useResponsive')) {
        this.passed.push('✅ TopThreeDisplay.tsx: 使用响应式hook');
      } else {
        this.warnings.push('⚠️ TopThreeDisplay.tsx: 未使用响应式hook');
      }
    }
  }

  // 运行完整验证
  async validate() {
    console.log('🚀 开始自适应布局验证...');
    console.log('=' .repeat(50));

    try {
      // 验证CSS文件
      const cssFiles = [
        path.join(this.srcDir, 'app/globals.css'),
        path.join(this.srcDir, 'styles/globals.css')
      ].filter(file => fs.existsSync(file));

      for (const cssFile of cssFiles) {
        const content = fs.readFileSync(cssFile, 'utf8');
        this.validateCSS(cssFile, content);
      }

      // 验证React组件文件
      const componentFiles = [
        path.join(this.srcDir, 'app/ranking/page.tsx'),
        path.join(this.srcDir, 'components/TopThreeDisplay.tsx'),
        path.join(this.srcDir, 'components/RankingTable.tsx'),
        path.join(this.srcDir, 'components/Header.tsx')
      ].filter(file => fs.existsSync(file));

      for (const componentFile of componentFiles) {
        const content = fs.readFileSync(componentFile, 'utf8');
        this.validateReact(componentFile, content);
      }

      // 验证布局文件
      this.validateLayoutFiles();

      // 输出验证结果
      this.printResults();

    } catch (error) {
      console.error('❌ 验证过程中出现错误:', error.message);
    }
  }

  // 打印验证结果
  printResults() {
    console.log('\n' + '=' .repeat(50));
    console.log('📊 验证结果汇总');
    console.log('=' .repeat(50));

    if (this.passed.length > 0) {
      console.log('\n✅ 通过的检查项:');
      this.passed.forEach(item => console.log(`  ${item}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ 警告项:');
      this.warnings.forEach(item => console.log(`  ${item}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ 错误项:');
      this.errors.forEach(item => console.log(`  ${item}`));
    }

    console.log('\n' + '=' .repeat(50));
    console.log(`📈 验证统计: 通过 ${this.passed.length} | 警告 ${this.warnings.length} | 错误 ${this.errors.length}`);
    
    if (this.errors.length === 0) {
      console.log('🎉 恭喜！所有关键检查项都已通过！');
    } else {
      console.log('🔧 请修复上述错误项后重新验证。');
    }

    console.log('=' .repeat(50));

    // 生成验证报告
    this.generateReport();
  }

  // 生成验证报告
  generateReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(__dirname, `validation-report-${timestamp}.md`);
    
    const report = `# 自适应布局验证报告

**验证时间**: ${new Date().toLocaleString()}

## 验证结果

### ✅ 通过项目 (${this.passed.length})
${this.passed.map(item => `- ${item}`).join('\n')}

### ⚠️ 警告项目 (${this.warnings.length})
${this.warnings.map(item => `- ${item}`).join('\n')}

### ❌ 错误项目 (${this.errors.length})
${this.errors.map(item => `- ${item}`).join('\n')}

## 总结

- **通过**: ${this.passed.length} 项
- **警告**: ${this.warnings.length} 项  
- **错误**: ${this.errors.length} 项

${this.errors.length === 0 ? '🎉 **所有关键检查项都已通过！**' : '🔧 **请修复错误项后重新验证。**'}

---
*此报告由自适应布局验证脚本自动生成*
`;

    fs.writeFileSync(reportPath, report);
    console.log(`📄 验证报告已生成: ${reportPath}`);
  }
}

// 运行验证
if (require.main === module) {
  const validator = new AdaptiveLayoutValidator();
  validator.validate();
}

module.exports = AdaptiveLayoutValidator;