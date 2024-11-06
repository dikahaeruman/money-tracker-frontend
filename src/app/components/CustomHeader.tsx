import React from 'react';
import { Avatar, Flex, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import {
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styles from './CustomHeader.module.css'

interface CustomHeaderProps {
  username? : string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ username = 'Guest' }) => {
  return (
    <Flex align="center" justify="space-between">
      <Typography.Title level={3} type="secondary">
        Welcome back, {username}!
      </Typography.Title>

      <Flex align="center" gap="3rem">
        <Search placeholder="Search Dashboard" allowClear />

        <Flex align="center" gap="10px">
          <MessageOutlined className={styles.headerIcon}/>
          <NotificationOutlined className={styles.headerIcon}/>
          <Avatar icon={<UserOutlined />} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CustomHeader;