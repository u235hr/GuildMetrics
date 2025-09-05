import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { useCurrentMonthData, useChartData } from '../store';

const DataExport: React.FC = () => {
  const currentMonthData = useCurrentMonthData();
  const chartData = useChartData();
  const [showDropdown, setShowDropdown] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportXLSX = () => {
    if (!currentMonthData) {
      alert('没有可导出的数据');
      return;
    }

    try {
      const wb = XLSX.utils.book_new();
      
      // 导出主播排名
      const rankingData = currentMonthData.streamers.map(s => ({
        '排名': s.rank,
        '主播': s.name,
        '礼物值': s.giftValue,
        '总礼物值占比 (%)': s.percentageOfTotal,
        '等级': s.level,
      }));
      const wsRanking = XLSX.utils.json_to_sheet(rankingData);
      XLSX.utils.book_append_sheet(wb, wsRanking, '主播排名');

      // 导出图表数据
      if (chartData && chartData.trendChart.length > 0) {
          const trendData = chartData.trendChart.map(t => ({
              '月份': t.month,
              '总礼物值': t.totalGiftValue,
              '主播数量': t.streamerCount,
              '平均礼物值': t.averageGiftValue,
          }));
          const wsTrend = XLSX.utils.json_to_sheet(trendData);
          XLSX.utils.book_append_sheet(wb, wsTrend, '月度趋势');
      }

      XLSX.writeFile(wb, `月度数据报告-${currentMonthData.month}月.xlsx`);
      alert('Excel 文件已导出');
    } catch (error) {
      console.error('导出Excel失败:', error);
      alert('导出Excel失败');
    } finally {
      setShowDropdown(false);
    }
  };

  const handleExportImage = async () => {
    const chartElement = document.getElementById('chart-container');
    const tableElement = document.getElementById('ranking-table');

    if (!chartElement || !tableElement) {
      alert('无法找到需要导出的图表或表格元素');
      return;
    }

    try {
      setExporting(true);
      const chartCanvas = await html2canvas(chartElement, { backgroundColor: '#1f1f1f' });
      const tableCanvas = await html2canvas(tableElement, { backgroundColor: '#141414' });
      
      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');
      if (!ctx) {
        alert('无法创建画布');
        return;
      }

      combinedCanvas.width = Math.max(chartCanvas.width, tableCanvas.width);
      combinedCanvas.height = chartCanvas.height + tableCanvas.height + 20; // 20px for spacing
      ctx.fillStyle = '#141414';
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
      
      ctx.drawImage(chartCanvas, 0, 0);
      ctx.drawImage(tableCanvas, 0, chartCanvas.height + 20);

      const link = document.createElement('a');
      link.download = 'dashboard-snapshot.png';
      link.href = combinedCanvas.toDataURL('image/png');
      link.click();
      alert('仪表盘快照已导出');
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出图片失败');
    } finally {
      setExporting(false);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg  transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        导出数据
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
            <button
              className="flex items-center w-full px-4 py-3 text-left text-white  transition-colors rounded-t-lg"
              onClick={handleExportXLSX}
            >
              <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              导出为 Excel
            </button>
            <button
              className="flex items-center w-full px-4 py-3 text-left text-white  transition-colors rounded-b-lg"
              onClick={handleExportImage}
              disabled={exporting}
            >
              {exporting ? (
                <svg className="w-5 h-5 mr-3 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              )}
              导出为图片
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DataExport;