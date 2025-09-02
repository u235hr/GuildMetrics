// 表格滚动功能测试脚本
console.log('🧪 开始测试表格滚动功能...');

// 等待页面完全加载
setTimeout(() => {
  // 查找滚动容器
  const scrollContainer = document.querySelector('.table-body-scroll');
  const rankingTable = document.querySelector('.ranking-table');
  const simpleTable = document.querySelector('.simple-scrollable-table');
  
  console.log('🔍 查找滚动容器:');
  console.log('- .table-body-scroll:', scrollContainer ? '✅ 找到' : '❌ 未找到');
  console.log('- .ranking-table:', rankingTable ? '✅ 找到' : '❌ 未找到');
  console.log('- .simple-scrollable-table:', simpleTable ? '✅ 找到' : '❌ 未找到');
  
  if (scrollContainer) {
    console.log('\n📏 滚动容器尺寸信息:');
    console.log('- clientHeight (可视高度):', scrollContainer.clientHeight + 'px');
    console.log('- scrollHeight (总内容高度):', scrollContainer.scrollHeight + 'px');
    console.log('- offsetHeight (包含边框高度):', scrollContainer.offsetHeight + 'px');
    console.log('- scrollTop (当前滚动位置):', scrollContainer.scrollTop + 'px');
    
    const computedStyle = window.getComputedStyle(scrollContainer);
    console.log('\n🎨 计算样式:');
    console.log('- height:', computedStyle.height);
    console.log('- max-height:', computedStyle.maxHeight);
    console.log('- overflow-y:', computedStyle.overflowY);
    console.log('- overflow-x:', computedStyle.overflowX);
    
    const canScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight;
    console.log('\n🎯 滚动能力分析:');
    console.log('- 内容超出容器:', canScroll ? '✅ 是' : '❌ 否');
    console.log('- 超出高度:', (scrollContainer.scrollHeight - scrollContainer.clientHeight) + 'px');
    
    if (canScroll) {
      console.log('\n🚀 开始滚动测试...');
      
      // 测试滚动到中间
      const middlePosition = scrollContainer.scrollHeight / 2;
      scrollContainer.scrollTop = middlePosition;
      console.log('- 滚动到中间位置:', scrollContainer.scrollTop + 'px');
      
      setTimeout(() => {
        // 测试滚动到底部
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        console.log('- 滚动到底部位置:', scrollContainer.scrollTop + 'px');
        
        setTimeout(() => {
          // 滚动回顶部
          scrollContainer.scrollTop = 0;
          console.log('- 滚动回顶部位置:', scrollContainer.scrollTop + 'px');
          
          console.log('\n🎉 滚动测试完成！');
          console.log('\n💡 手动测试提示:');
          console.log('1. 在表格区域使用鼠标滚轮');
          console.log('2. 拖动右侧滚动条');
          console.log('3. 使用键盘上下箭头键（需先点击表格获得焦点）');
          
          // 高亮显示滚动容器
          scrollContainer.style.border = '3px solid #52c41a';
          scrollContainer.style.boxShadow = '0 0 10px rgba(82, 196, 26, 0.5)';
          
          setTimeout(() => {
            scrollContainer.style.border = '';
            scrollContainer.style.boxShadow = '';
          }, 3000);
          
        }, 500);
      }, 500);
    } else {
      console.log('\n⚠️ 警告: 内容高度不足，无法触发滚动功能');
      console.log('建议: 添加更多数据或减小容器高度');
    }
    
    // 检查表格行数
    const tableRows = scrollContainer.querySelectorAll('.table-row');
    console.log('\n📊 表格数据:');
    console.log('- 表格行数:', tableRows.length);
    console.log('- 每行平均高度:', tableRows.length > 0 ? (scrollContainer.scrollHeight / tableRows.length).toFixed(2) + 'px' : '未知');
    
  } else {
    console.log('\n❌ 错误: 未找到滚动容器 (.table-body-scroll)');
    console.log('请检查组件是否正确渲染');
  }
  
}, 2000);

console.log('⏳ 等待2秒后开始测试...');