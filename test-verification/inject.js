/**
 * TOP3区域样式验证脚本
 * 此脚本用于验证TOP3区域的样式修改是否正确应用
 * 使用方法：在浏览器控制台中执行此脚本
 */

(function() {
  // 创建验证面板
  function createVerificationPanel() {
    // 如果已存在面板，则移除
    const existingPanel = document.getElementById('style-verification-panel');
    if (existingPanel) {
      existingPanel.remove();
    }
    
    // 创建面板容器
    const panel = document.createElement('div');
    panel.id = 'style-verification-panel';
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 350px;
      max-height: 80vh;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      overflow-y: auto;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      color: #333;
      padding: 15px;
    `;
    
    // 添加标题
    const title = document.createElement('h2');
    title.textContent = 'TOP3区域样式验证';
    title.style.cssText = `
      margin: 0 0 15px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      font-size: 18px;
      font-weight: bold;
      color: #2c3e50;
    `;
    panel.appendChild(title);
    
    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #999;
    `;
    closeButton.onclick = function() {
      panel.remove();
    };
    panel.appendChild(closeButton);
    
    // 添加验证结果容器
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'verification-results';
    panel.appendChild(resultsContainer);
    
    // 添加验证按钮
    const verifyButton = document.createElement('button');
    verifyButton.textContent = '重新验证';
    verifyButton.style.cssText = `
      background-color: #3498db;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 15px;
      font-size: 14px;
    `;
    verifyButton.onclick = function() {
      runVerification();
    };
    panel.appendChild(verifyButton);
    
    // 添加到文档
    document.body.appendChild(panel);
    
    return resultsContainer;
  }
  
  // 创建验证结果项
  function createResultItem(name, passed, details) {
    const item = document.createElement('div');
    item.style.cssText = `
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 4px;
      background-color: ${passed ? '#eaffea' : '#ffecec'};
      border-left: 4px solid ${passed ? '#27ae60' : '#e74c3c'};
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    `;
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;
    nameSpan.style.fontWeight = 'bold';
    header.appendChild(nameSpan);
    
    const statusSpan = document.createElement('span');
    statusSpan.textContent = passed ? '✓ 通过' : '✗ 未通过';
    statusSpan.style.color = passed ? '#27ae60' : '#e74c3c';
    header.appendChild(statusSpan);
    
    item.appendChild(header);
    
    if (details) {
      const detailsDiv = document.createElement('div');
      detailsDiv.style.cssText = `
        font-size: 12px;
        margin-top: 5px;
        color: #666;
      `;
      detailsDiv.textContent = details;
      item.appendChild(detailsDiv);
    }
    
    return item;
  }
  
  // 验证TOP3区域高度
  function verifyTopThreeHeight() {
    const topThreeSection = document.querySelector('section.modern-top-three');
    if (!topThreeSection) {
      return {
        passed: false,
        details: '未找到TOP3区域元素'
      };
    }
    
    // 检查maxHeight样式
    const maxHeightStyle = topThreeSection.style.maxHeight;
    const hasMaxHeight = maxHeightStyle === '50%';
    
    // 检查高度是否自适应
    const computedStyle = window.getComputedStyle(topThreeSection);
    const heightValue = computedStyle.height;
    const isAutoHeight = !topThreeSection.style.height || topThreeSection.style.height === 'auto';
    
    // 计算TOP3区域占页面的比例
    const topThreeHeight = topThreeSection.offsetHeight;
    const pageHeight = window.innerHeight;
    const heightRatio = (topThreeHeight / pageHeight * 100).toFixed(1);
    
    return {
      passed: hasMaxHeight && isAutoHeight && heightRatio <= 50,
      details: `高度占比: ${heightRatio}%, maxHeight: ${maxHeightStyle || '未设置'}, height: ${heightValue}, 自适应: ${isAutoHeight ? '是' : '否'}`
    };
  }
  
  // 验证内部元素尺寸
  function verifyInnerElementSizes() {
    const results = [];
    
    // 验证article元素
    const articles = document.querySelectorAll('article.top-three-card');
    if (articles.length === 0) {
      results.push({
        name: 'TOP3卡片',
        passed: false,
        details: '未找到卡片元素'
      });
    } else {
      const article = articles[0];
      const classes = article.className;
      
      // 检查padding和margin
      const hasPadding = classes.includes('p-1');
      const hasMargin = classes.includes('mb-0.5');
      const hasAutoHeight = classes.includes('h-auto');
      
      results.push({
        name: 'TOP3卡片',
        passed: hasPadding && hasMargin && hasAutoHeight,
        details: `类名: ${classes}, p-1: ${hasPadding ? '是' : '否'}, mb-0.5: ${hasMargin ? '是' : '否'}, h-auto: ${hasAutoHeight ? '是' : '否'}`
      });
    }
    
    // 验证图标尺寸
    const icons = document.querySelectorAll('section.modern-top-three svg');
    if (icons.length > 0) {
      let smallIconsCount = 0;
      icons.forEach(icon => {
        const classes = icon.className.baseVal;
        if (classes.includes('w-3 h-3') || classes.includes('w-2 h-2')) {
          smallIconsCount++;
        }
      });
      
      results.push({
        name: '图标尺寸',
        passed: smallIconsCount > 0,
        details: `找到 ${smallIconsCount}/${icons.length} 个符合要求的小尺寸图标`
      });
    }
    
    // 验证字体大小
    const textElements = document.querySelectorAll('section.modern-top-three h3, section.modern-top-three strong, section.modern-top-three dd');
    if (textElements.length > 0) {
      let smallTextCount = 0;
      textElements.forEach(el => {
        const classes = el.className;
        if (classes.includes('text-xs') || classes.includes('text-sm')) {
          smallTextCount++;
        }
      });
      
      results.push({
        name: '字体大小',
        passed: smallTextCount > 0,
        details: `找到 ${smallTextCount}/${textElements.length} 个符合要求的小字体元素`
      });
    }
    
    return results;
  }
  
  // 验证表格区域
  function verifyTableArea() {
    const tableContainer = document.querySelector('.modern-ranking-table');
    if (!tableContainer) {
      return {
        passed: false,
        details: '未找到表格容器'
      };
    }
    
    // 检查表格是否有足够空间
    const topThreeSection = document.querySelector('section.modern-top-three');
    const pageHeight = window.innerHeight;
    const topThreeHeight = topThreeSection ? topThreeSection.offsetHeight : 0;
    const tableHeight = tableContainer.offsetHeight;
    
    // 计算表格占页面的比例
    const tableRatio = (tableHeight / pageHeight * 100).toFixed(1);
    const topThreeRatio = (topThreeHeight / pageHeight * 100).toFixed(1);
    
    // 表格应该占据页面的大部分空间
    return {
      passed: tableRatio > 40,
      details: `表格高度占比: ${tableRatio}%, TOP3高度占比: ${topThreeRatio}%, 表格实际高度: ${tableHeight}px`
    };
  }
  
  // 验证间距和网格
  function verifySpacingAndGrid() {
    const grid = document.querySelector('.top-three-grid');
    if (!grid) {
      return {
        passed: false,
        details: '未找到网格容器'
      };
    }
    
    // 获取计算样式
    const computedStyle = window.getComputedStyle(grid);
    const gap = computedStyle.gap;
    const padding = computedStyle.padding;
    
    // 检查gap和padding是否减小
    // 由于clamp函数的计算结果会根据视口大小变化，我们只能检查值是否在合理范围内
    const gapValue = parseFloat(gap);
    const paddingValue = parseFloat(padding);
    
    return {
      passed: gapValue <= 12 && paddingValue <= 12,
      details: `网格间距: ${gap}, 内边距: ${padding}`
    };
  }
  
  // 运行所有验证
  function runVerification() {
    const resultsContainer = createVerificationPanel();
    resultsContainer.innerHTML = '';
    
    // 验证TOP3区域高度
    const heightResult = verifyTopThreeHeight();
    resultsContainer.appendChild(createResultItem('TOP3区域高度', heightResult.passed, heightResult.details));
    
    // 验证内部元素尺寸
    const sizeResults = verifyInnerElementSizes();
    sizeResults.forEach(result => {
      resultsContainer.appendChild(createResultItem(result.name, result.passed, result.details));
    });
    
    // 验证表格区域
    const tableResult = verifyTableArea();
    resultsContainer.appendChild(createResultItem('表格区域空间', tableResult.passed, tableResult.details));
    
    // 验证间距和网格
    const spacingResult = verifySpacingAndGrid();
    resultsContainer.appendChild(createResultItem('网格间距和内边距', spacingResult.passed, spacingResult.details));
    
    // 添加总结
    const passedCount = [heightResult.passed, ...sizeResults.map(r => r.passed), tableResult.passed, spacingResult.passed].filter(Boolean).length;
    const totalCount = 1 + sizeResults.length + 1 + 1;
    
    const summary = document.createElement('div');
    summary.style.cssText = `
      margin-top: 15px;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
    `;
    summary.textContent = `验证结果: ${passedCount}/${totalCount} 通过`;
    summary.style.color = passedCount === totalCount ? '#27ae60' : passedCount > totalCount / 2 ? '#f39c12' : '#e74c3c';
    resultsContainer.appendChild(summary);
  }
  
  // 执行验证
  runVerification();
})();