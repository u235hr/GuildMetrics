/**
 * 存储管理组件 - 管理本地存储的数据
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Modal, 
  List, 
  Tag, 
  Progress, 
  Statistic, 
  Row, 
  Col,
  message,
  Popconfirm,
  Typography,
  Space,
  Alert,
  Divider
} from 'antd';
import { 
  DatabaseOutlined, 
  DeleteOutlined, 
  ExportOutlined, 
  ImportOutlined,
  FileTextOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { LocalStorageManager, type StoredFile } from '../utils/localStorageManager';

const { Text } = Typography;

const StorageManager: React.FC = () => {
  const [storageStats, setStorageStats] = useState({
    monthlyDataCount: 0,
    uploadedFilesCount: 0,
    totalSize: 0,
    lastUpdate: null as string | null
  });
  const [uploadHistory, setUploadHistory] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // 加载存储统计信息
  const loadStorageStats = async () => {
    try {
      const stats = await LocalStorageManager.getStorageStats();
      setStorageStats(stats);
      
      const history = await LocalStorageManager.getUploadHistory(20);
      setUploadHistory(history);
    } catch {
      message.error('加载存储信息失败');
    }
  };

  useEffect(() => {
    loadStorageStats();
  }, []);

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 清空所有数据
  const handleClearAllData = async () => {
    setLoading(true);
    try {
      await LocalStorageManager.clearAllData();
      message.success('所有数据已清空');
      await loadStorageStats();
    } catch {
      message.error('清空数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 清理旧文件
  const handleCleanupOldFiles = async () => {
    setLoading(true);
    try {
      await LocalStorageManager.cleanupOldFiles(20);
      message.success('旧文件清理完成');
      await loadStorageStats();
    } catch {
      message.error('清理文件失败');
    } finally {
      setLoading(false);
    }
  };

  // 导出备份
  const handleExportBackup = async () => {
    setLoading(true);
    try {
      const backup = await LocalStorageManager.exportBackup();
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `streamer-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      message.success('备份导出成功');
      setShowExportModal(false);
    } catch {
      message.error('导出备份失败');
    } finally {
      setLoading(false);
    }
  };

  // 导入备份
  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setLoading(true);
      try {
        const content = await file.text();
        const backup = JSON.parse(content);
        
        await LocalStorageManager.importBackup(backup);
        message.success('备份导入成功');
        await loadStorageStats();
      } catch {
        message.error('导入备份失败：文件格式错误');
      } finally {
        setLoading(false);
      }
    };
    
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* 存储统计概览 */}
      <Card title={
        <div className="flex items-center space-x-2">
          <DatabaseOutlined />
          <span>存储统计</span>
        </div>
      }>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={6}>
            <Statistic
              title="月度数据"
              value={storageStats.monthlyDataCount}
              suffix="个月"
              prefix={<CalendarOutlined />}
            />
          </Col>
          
          <Col xs={24} sm={6}>
            <Statistic
              title="上传文件"
              value={storageStats.uploadedFilesCount}
              suffix="个"
              prefix={<FileTextOutlined />}
            />
          </Col>
          
          <Col xs={24} sm={6}>
            <Statistic
              title="存储大小"
              value={formatFileSize(storageStats.totalSize)}
              prefix={<DatabaseOutlined />}
            />
          </Col>
          
          <Col xs={24} sm={6}>
            <Statistic
              title="最后更新"
              value={storageStats.lastUpdate ? 
                new Date(storageStats.lastUpdate).toLocaleDateString() : 
                '无'
              }
            />
          </Col>
        </Row>

        <Divider />

        {/* 存储使用情况 */}
        <div className="mb-4">
          <Text strong>存储使用情况：</Text>
          <div className="mt-2">
            <Progress 
              percent={Math.min((storageStats.totalSize / (50 * 1024 * 1024)) * 100, 100)} 
              strokeColor={{
                '0%': '#52c41a',
                '50%': '#faad14',
                '80%': '#ff4d4f',
              }}
              format={() => `${formatFileSize(storageStats.totalSize)} / 50MB`}
            />
            <Text type="secondary" className="text-xs">
              建议定期清理旧数据以保持良好性能
            </Text>
          </div>
        </div>

        {/* 操作按钮 */}
        <Space wrap>
          <Button 
            icon={<ExportOutlined />}
            onClick={() => setShowExportModal(true)}
          >
            导出备份
          </Button>
          
          <Button 
            icon={<ImportOutlined />}
            onClick={handleImportBackup}
          >
            导入备份
          </Button>
          
          <Button 
            icon={<DeleteOutlined />}
            onClick={handleCleanupOldFiles}
            loading={loading}
          >
            清理旧文件
          </Button>
          
          <Popconfirm
            title="确认清空所有数据？"
            description="此操作将删除所有本地存储的数据，且无法恢复。"
            onConfirm={handleClearAllData}
            okText="确认"
            cancelText="取消"
            icon={<WarningOutlined style={{ color: 'red' }} />}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              loading={loading}
            >
              清空所有数据
            </Button>
          </Popconfirm>
        </Space>
      </Card>

      {/* 上传历史 */}
      <Card title="上传历史" extra={
        <Button size="small" onClick={loadStorageStats}>
          刷新
        </Button>
      }>
        {uploadHistory.length > 0 ? (
          <List
            dataSource={uploadHistory}
            renderItem={(file) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<FileTextOutlined style={{ fontSize: 20, color: '#1677ff' }} />}
                  title={
                    <div className="flex items-center space-x-2">
                      <span>{file.fileName}</span>
                      <Tag color="blue">{file.year}年{file.month}月</Tag>
                    </div>
                  }
                  description={
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>大小：{formatFileSize(file.fileSize)}</span>
                      <span>上传时间：{new Date(file.uploadTime).toLocaleString()}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
            pagination={{
              pageSize: 10,
              size: 'small',
              showSizeChanger: false,
            }}
          />
        ) : (
          <Alert 
            message="暂无上传历史" 
            type="info" 
            showIcon 
          />
        )}
      </Card>

      {/* 数据安全提示 */}
      <Card title={
        <div className="flex items-center space-x-2">
          <InfoCircleOutlined />
          <span>数据安全提示</span>
        </div>
      }>
        <Alert
          message="数据安全建议"
          description={
            <ul className="mt-2 space-y-1">
              <li>• 定期导出数据备份，以防数据丢失</li>
              <li>• 浏览器清理缓存时可能会清除本地数据</li>
              <li>• 建议在重要操作前先导出备份</li>
              <li>• 上传的原始文件也会被保存，可以随时重新解析</li>
            </ul>
          }
          type="info"
          showIcon
        />
      </Card>

      {/* 导出备份模态框 */}
      <Modal
        title="导出数据备份"
        open={showExportModal}
        onCancel={() => setShowExportModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowExportModal(false)}>
            取消
          </Button>,
          <Button 
            key="export" 
            type="primary" 
            icon={<ExportOutlined />}
            loading={loading}
            onClick={handleExportBackup}
          >
            开始导出
          </Button>
        ]}
      >
        <div className="space-y-4">
          <Alert
            message="导出内容包括："
            description={
              <ul className="mt-2">
                <li>• 所有月度数据 ({storageStats.monthlyDataCount} 个月)</li>
                <li>• 用户设置和偏好</li>
                <li>• 上传历史记录</li>
                <li>• 导出时间戳</li>
              </ul>
            }
            type="info"
            showIcon
          />
          
          <div className="bg-gray-50 p-3 rounded">
            <Text strong>导出信息：</Text>
            <div className="mt-1 text-sm space-y-1">
              <div>文件格式：JSON</div>
              <div>预估大小：{formatFileSize(storageStats.totalSize * 1.2)}</div>
              <div>文件名：streamer-dashboard-backup-{new Date().toISOString().split('T')[0]}.json</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StorageManager;