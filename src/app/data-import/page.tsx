'use client';

import React from 'react';
import { Layout, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, CloudUploadOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Header from '../../components/Header';
import DataImport from '../../components/DataImport';

const { Content } = Layout;
const { Title } = Typography;

const DataImportPage: React.FC = () => {
  return (
    <Layout className="single-screen-layout">
      <Header />
      <Content className="content-area">
        <div className="scrollable-content">
          <div className="container-custom compact-spacing">
            <div className="compact-margin">
              <Breadcrumb
                items={[
                  {
                    title: (
                      <Link href="/" className="flex items-center">
                        <HomeOutlined className="mr-1" />
                        主页
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <span className="flex items-center">
                        <CloudUploadOutlined className="mr-1" />
                        数据导入
                      </span>
                    ),
                  },
                ]}
              />
            </div>
            
            <div className="compact-margin">
              <Title level={2} className="responsive-title text-gradient">
                数据导入中心
              </Title>
              <p className="responsive-text text-gray-600 dark:text-gray-400">
                上传和管理主播数据，支持多种格式导入
              </p>
            </div>

            <div className="max-w-4xl mx-auto flex-1">
              <DataImport />
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default DataImportPage;