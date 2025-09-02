'use client';

import { ConfigProvider, theme, App as AntApp } from 'antd';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#1677ff',
                    borderRadius: 8,
                },
            }}
        >
            <AntApp>{children}</AntApp>
        </ConfigProvider>
    );
}