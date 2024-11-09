'use client';

import React, { useState } from 'react';
import { Button, Layout, Spin } from 'antd';
import Sidebar from '@/app/components/Sidebar';
import styles from './page.module.css';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import CustomHeader from '@/app/components/CustomHeader';
import { useQuery } from '@tanstack/react-query';
import SettingsContent from '@/app/components/SettingsContent';
import DashboardContent from '@/app/components/dashboard/DashboardContent';
import { useUser } from '@/contexts/UserContext';

const { Sider, Header, Content } = Layout;

const Dashboard = () => {
  const [currentContent, setCurrentContent] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const { user, setUser, loading } = useUser();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentContent) {
      case 'dashboard':
        return <DashboardContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Layout>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sider"
      >
        <Sidebar onMenuSelect={setCurrentContent} />
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className={styles.triggerButton}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <CustomHeader />
        </Header>
        <Content className={styles.content}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
