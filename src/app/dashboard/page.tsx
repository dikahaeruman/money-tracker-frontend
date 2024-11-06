'use client';

import React, { useState } from 'react';
import { Button, Layout, Spin } from 'antd';
import Sidebar from '@/app/components/Sidebar';
import styles from './page.module.css';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import CustomHeader from '@/app/components/CustomHeader';
import { useQuery } from '@tanstack/react-query';

const { Sider, Header, Content } = Layout;

const fetchUser = async () => {
  console.log('fetchUser called');
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      if (!response.ok) {
        return { error: `Failed to fetch user data. Status: ${response.status}` };
      }
      return await response.json();
    } else {
      // If the response is not JSON, read it as text
      const text = await response.text();
      console.error('Non-JSON response:', text);
      return { error: `Unexpected response format. Status: ${response.status}` };
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { error: 'An error occurred while fetching user data' };
  }
}

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUser(),
    staleTime: Infinity,
    retry: 3,
  })

  if (isLoading) {
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

  if (error) {
    return <div>Error loading user data: {error.message}</div>;
  }

  return (
    <Layout>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sider"
      >
        <Sidebar />
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className={styles.triggerButton}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <CustomHeader username={user?.username}/>
        </Header>
        <Content className={styles.content}>Content</Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
