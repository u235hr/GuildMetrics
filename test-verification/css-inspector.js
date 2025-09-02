/**
 * CSS样式验证工具
 * 用于检测页面上的CSS样式是否正确应用
 */

// 保存到localStorage以便在页面刷新后仍能查看结果
function saveResults(results) {
  localStorage.setItem('css_validation_results', JSON.stringify(results));
  localStorage.setItem('css_validation_timestamp', new Date().toISOString());
}

// 从localStorage加载结果
function loadResults() {
  const results = localStorage.getItem('css_validation_results');
  const timestamp = localStorage.getItem('css_validation_timestamp');
  
  if (results && timestamp) {
    return {
      results: JSON.parse(results),
      timestamp: new Date(timestamp)
    };
  }
  
  return null;
}

// 验证TOP3区域的样式
function validateTop3Styles() {
  console.log('开始验证TOP3区域样式...');
  const results = {
    timestamp: new Date().toISOString(),
    top3: {},
    table: {},
    overall: {}
  };
  
  // 检查TOP3区域
  const top3Section = document.querySelector('.modern-top-three');
  if (!top3Section) {
    results.top3.error = '找不到TOP3区域元素 (.modern-top-three)';
    console.error(results.top3.error);
    return results;
  }
  
  // 获取TOP3区域的计算样式
  const top3Styles = window.getComputedStyle(top3Section);
  results.top3.height = top3Styles.height;
  results.top3.maxHeight = top3Styles.maxHeight;
  
  // 检查卡片内部样式
  const cards = top3Section.querySelectorAll('.top-three-card');
  results.top3.cards = [];
  
  cards.forEach((card, index) => {
    const cardStyles = window.getComputedStyle(card);
    const cardInner = card.querySelector('.card-inner');
    const cardInnerStyles = cardInner ? window.getComputedStyle(cardInner) : null;
    const cardContent = card.querySelector('.card-content');
    const cardContentStyles = cardContent ? window.getComputedStyle(cardContent) : null;
    
    results.top3.cards.push({
      index,
      height: cardStyles.height,
      padding: cardStyles.padding,
      innerHeight: cardInnerStyles ? cardInnerStyles.height : 'N/A',
      contentPadding: cardContentStyles ? cardContentStyles.padding : 'N/A'
    });
  });
  
  // 检查表格区域
  const tableSection = document.querySelector('.modern-ranking-table');
  if (tableSection) {
    const tableStyles = window.getComputedStyle(tableSection);
    results.table.height = tableStyles.height;
    results.table.maxHeight = tableStyles.maxHeight;
    results.table.overflow = tableStyles.overflow;
    results.table.overflowY = tableStyles.overflowY;
  } else {
    results.table.error = '找不到表格区域元素 (.modern-ranking-table)';
  }
  
  // 检查整体布局
  const mainContainer = document.querySelector('main');
  if (mainContainer) {
    const mainStyles = window.getComputedStyle(mainContainer);
    results.overall.height = mainStyles.height;
    results.overall.display = mainStyles.display;
    results.overall.flexDirection = mainStyles.flexDirection;
  }
  
  // 分析结果
  analyzeResults(results);
  
  // 保存结果
  saveResults(results);
  
  console.log('验证完成，结果已保存');
  console.log(results);
  
  return results;
}

// 分析验证结果
function analyzeResults(results) {
  results.analysis = {};
  
  // 分析TOP3区域高度
  if (results.top3.height) {
    const heightValue = parseFloat(results.top3.height);
    results.analysis.top3Height = {
      value: heightValue,
      isAuto: results.top3.height === 'auto',
      isSmallEnough: heightValue < 200 // 假设小于200px为足够小
    };
  }
  
  // 分析卡片内部样式
  if (results.top3.cards && results.top3.cards.length > 0) {
    results.analysis.cardStyles = {
      allCardsHaveAutoHeight: results.top3.cards.every(card => card.height === 'auto' || card.innerHeight === 'auto'),
      smallPadding: results.top3.cards.every(card => {
        const padding = card.contentPadding;
        if (!padding || padding === 'N/A') return false;
        
        // 提取padding值并检查是否足够小
        const paddingValues = padding.split(' ').map(val => parseFloat(val));
        return paddingValues.every(val => val < 10); // 假设小于10px为足够小
      })
    };
  }
  
  // 分析表格区域
  if (results.table.height && !results.table.error) {
    results.analysis.tableHeight = {
      value: parseFloat(results.table.height),
      hasScroll: results.table.overflowY === 'auto' || results.table.overflowY === 'scroll'
    };
  }
  
  // 总体评估
  results.analysis.overall = {
    top3HeightReduced: results.analysis.top3Height && (results.analysis.top3Height.isAuto || results.analysis.top3Height.isSmallEnough),
    paddingCompressed: results.analysis.cardStyles && results.analysis.cardStyles.smallPadding,
    tableHasScroll: results.analysis.tableHeight && results.analysis.tableHeight.hasScroll
  };
  
  // 最终结论
  results.analysis.conclusion = {
    success: results.analysis.overall.top3HeightReduced && results.analysis.overall.paddingCompressed,
    message: results.analysis.overall.top3HeightReduced && results.analysis.overall.paddingCompressed ?
      '验证成功：TOP3区域高度已减小，内边距已压缩' :
      '验证失败：部分修改未生效，请检查详细结果'
  };
}

// 创建结果显示面板
function createResultPanel(results) {
  // 移除已有的面板
  const existingPanel = document.getElementById('css-validation-panel');
  if (existingPanel) {
    existingPanel.remove();
  }
  
  // 创建新面板
  const panel = document.createElement('div');
  panel.id = 'css-validation-panel';
  panel.style.position = 'fixed';
  panel.style.bottom = '20px';
  panel.style.right = '20px';
  panel.style.width = '400px';
  panel.style.maxHeight = '80vh';
  panel.style.overflowY = 'auto';
  panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  panel.style.color = 'white';
  panel.style.padding = '15px';
  panel.style.borderRadius = '8px';
  panel.style.zIndex = '9999';
  panel.style.fontFamily = 'monospace';
  panel.style.fontSize = '14px';
  panel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  
  // 添加标题
  const title = document.createElement('h2');
  title.textContent = 'CSS样式验证结果';
  title.style.margin = '0 0 15px 0';
  title.style.color = '#4CAF50';
  panel.appendChild(title);
  
  // 添加时间戳
  const timestamp = document.createElement('div');
  timestamp.textContent = `验证时间: ${new Date(results.timestamp).toLocaleString()}`;
  timestamp.style.marginBottom = '15px';
  timestamp.style.fontSize = '12px';
  timestamp.style.color = '#aaa';
  panel.appendChild(timestamp);
  
  // 添加结论
  const conclusion = document.createElement('div');
  conclusion.style.padding = '10px';
  conclusion.style.marginBottom = '15px';
  conclusion.style.borderRadius = '4px';
  conclusion.style.backgroundColor = results.analysis.conclusion.success ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)';
  conclusion.textContent = results.analysis.conclusion.message;
  panel.appendChild(conclusion);
  
  // 添加详细结果
  const details = document.createElement('pre');
  details.textContent = JSON.stringify(results, null, 2);
  details.style.maxHeight = '300px';
  details.style.overflowY = 'auto';
  details.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  details.style.padding = '10px';
  details.style.borderRadius = '4px';
  details.style.whiteSpace = 'pre-wrap';
  details.style.wordBreak = 'break-word';
  panel.appendChild(details);
  
  // 添加关闭按钮
  const closeButton = document.createElement('button');
  closeButton.textContent = '关闭';
  closeButton.style.backgroundColor = '#f44336';
  closeButton.style.color = 'white';
  closeButton.style.border = 'none';
  closeButton.style.padding = '8px 15px';
  closeButton.style.marginTop = '15px';
  closeButton.style.borderRadius = '4px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = () => panel.remove();
  panel.appendChild(closeButton);
  
  // 添加到页面
  document.body.appendChild(panel);
  
  return panel;
}

// 主函数：运行验证并显示结果
function runValidation() {
  const results = validateTop3Styles();
  createResultPanel(results);
  return results;
}

// 加载之前的结果
function showPreviousResults() {
  const savedResults = loadResults();
  if (savedResults) {
    createResultPanel(savedResults.results);
    return savedResults.results;
  }
  return null;
}

// 导出函数供控制台使用
window.cssValidator = {
  validate: runValidation,
  showPrevious: showPreviousResults
};

// 自动运行验证
setTimeout(() => {
  runValidation();
  console.log('CSS验证已完成，可以通过window.cssValidator.validate()再次运行验证');
}, 1000);