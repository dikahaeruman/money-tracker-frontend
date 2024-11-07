import React from 'react';
import { Avatar, Dropdown, Flex, MenuProps, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import {
  LogoutOutlined,
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styles from './CustomHeader.module.css';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useQueryClient } from '@tanstack/react-query';

interface CustomHeaderProps {
  username?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = () => {
  const router = useRouter();
  const {user, setUser} = useUser();
  const queryClient = useQueryClient();

  const items: MenuProps['items'] = [
    {
      label: `${user?.username} - ${user?.email}`,
      key: 'profile',
      disabled: true,
    },
    {
      type: 'divider'
    },
    {
      label: 'Logout',
      key: '1',
      icon: <LogoutOutlined />,
    },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      logoutHandler().catch((error) => {
        console.error('Error during logout:', error);
      });
    }
  };

  const logoutHandler = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (response.ok) {
        setUser(null);
        queryClient.clear();
        await queryClient.invalidateQueries();
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return (
    <Flex align="center" justify="space-between">
      <Typography.Title level={3} type="secondary">
        Money Tracker
      </Typography.Title>

      <Flex align="center" gap="3rem">
        <Search placeholder="Search Dashboard" allowClear />

        <Flex align="center" gap="10px">
          <MessageOutlined className={styles.headerIcon} />
          <NotificationOutlined className={styles.headerIcon} />
          <Dropdown menu={{ items, onClick }} className={styles.avatarMenu}>
            <span>
              <Avatar icon={<UserOutlined />} />
            </span>
          </Dropdown>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CustomHeader;