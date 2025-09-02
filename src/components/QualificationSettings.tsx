
import React from 'react';
import { Card, InputNumber, Typography, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useAppStore } from '../store';
import { shallow } from 'zustand/shallow';

const { Text } = Typography;

const QualificationSettings: React.FC = () => {
  const qualificationLine = useAppStore((state) => state.userSettings.qualificationLine);
  const { updateUserSettings } = useAppStore();

  const handleQualificationChange = (value: number | null) => {
    if (value !== null) {
      updateUserSettings({ qualificationLine: value });
    }
  };

  return (
    <Card title="合格线设置">
      <div className="flex items-center gap-2">
        <InputNumber
          className="w-40"
          value={qualificationLine}
          onChange={handleQualificationChange}
          min={0}
          step={1000}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => parseInt(value!.replace(/\$\s?|(,*)/g, ''), 10)}
        />
        <Text type="secondary">礼物值</Text>
        <Tooltip title="设置后将影响“达标人数”和“达标率”的统计">
          <InfoCircleOutlined className="cursor-help" />
        </Tooltip>
      </div>
    </Card>
  );
};

export default QualificationSettings;
