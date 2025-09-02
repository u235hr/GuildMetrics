
import React, { useState } from 'react';
import { Upload, Button, Card, Progress, Alert, List, Typography, Modal, Space } from 'antd';
import { 
  InboxOutlined, 
  CloudUploadOutlined,
  FileMarkdownOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { useAppStore } from '../store';

const { Dragger } = Upload;
const { Text } = Typography;

const DataImport: React.FC = () => {
  const { uploadStatus, setUploadStatus, loadMonthData } = useAppStore();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const beforeUpload = (file: File) => {
    if (!file.name.endsWith('.md')) {
      Modal.error({ title: '文件格式错误', content: '只支持上传 .md 格式的文件' });
      return false;
    }
    return false; // Prevent auto-upload
  };

  const handleFileChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      Modal.warning({ title: '请选择文件', content: '请先选择要上传的 MD 文件' });
      return;
    }

    setUploadStatus({ status: 'uploading', progress: 0, message: '开始处理...' });

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const progress = Math.round(((i + 1) / fileList.length) * 100);
      setUploadStatus({ status: 'parsing', progress, message: `正在解析 ${file.name}...` });

      try {
        if (file.originFileObj) {
          const content = await file.originFileObj.text();
          await loadMonthData(file.name, content);
        }
      } catch {
        // Error is handled within the store action
      }
    }
    setFileList([]);
  };

  return (
    <Card title="数据导入">
      <div className="flex flex-col space-y-4">
        <Dragger
          multiple
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={beforeUpload}
          accept=".md"
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">点击或拖拽 MD 文件到此区域</p>
          <p className="ant-upload-hint">支持单个或批量上传</p>
        </Dragger>

        {fileList.length > 0 && (
          <List
            size="small"
            bordered
            dataSource={fileList}
            renderItem={(file) => (
              <List.Item>
                <Text><FileMarkdownOutlined className="mr-2" />{file.name}</Text>
              </List.Item>
            )}
          />
        )}

        {uploadStatus.status !== 'idle' && (
          <div className="pt-2">
            <Alert 
              message={uploadStatus.message} 
              type={uploadStatus.status === 'uploading' || uploadStatus.status === 'parsing' ? 'info' : uploadStatus.status} 
              showIcon 
            />
            {(uploadStatus.status === 'uploading' || uploadStatus.status === 'parsing') && (
              <Progress percent={uploadStatus.progress} className="!mb-0" />
            )}
          </div>
        )}

        <Space className="w-full justify-end">
          <Button onClick={() => setFileList([])} icon={<DeleteOutlined />} disabled={fileList.length === 0}>清空</Button>
          <Button 
            type="primary" 
            icon={<CloudUploadOutlined />}
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploadStatus.status === 'uploading' || uploadStatus.status === 'parsing'}
          >
            开始导入
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default DataImport;
