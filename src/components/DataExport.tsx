
import React from 'react';
import { Button, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd/lib/menu';
import { DownloadOutlined, FileExcelOutlined, FileImageOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { useCurrentMonthData, useChartData } from '../store';

const DataExport: React.FC = () => {
  const currentMonthData = useCurrentMonthData();
  const chartData = useChartData();

  const handleExportXLSX = () => {
    if (!currentMonthData) {
      message.warning('没有可导出的数据');
      return;
    }

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
    message.success('Excel 文件已导出');
  };

  const handleExportImage = async () => {
    const chartElement = document.getElementById('chart-container');
    const tableElement = document.getElementById('ranking-table');

    if (!chartElement || !tableElement) {
      message.error('无法找到需要导出的图表或表格元素');
      return;
    }

    try {
      const chartCanvas = await html2canvas(chartElement, { backgroundColor: '#1f1f1f' });
      const tableCanvas = await html2canvas(tableElement, { backgroundColor: '#141414' });
      
      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');
      if (!ctx) return;

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
      message.success('仪表盘快照已导出');

    } catch (error) {
      console.error('导出图片失败:', error);
      message.error('导出图片失败');
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '导出为 Excel',
      icon: <FileExcelOutlined />,
      onClick: handleExportXLSX,
    },
    {
      key: '2',
      label: '导出为图片',
      icon: <FileImageOutlined />,
      onClick: handleExportImage,
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <Button icon={<DownloadOutlined />}>
        导出数据
      </Button>
    </Dropdown>
  );
};

export default DataExport;
