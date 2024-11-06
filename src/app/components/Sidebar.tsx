import React from 'react';
import { Flex, Menu } from 'antd';
import {
  HomeOutlined,
  RocketOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <>
      <Flex align="center" justify="center">
        <div className={styles.logo}>
          <RocketOutlined />
        </div>
      </Flex>

      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        className={styles.menuBar}
        items={[
          {
            key: '1',
            icon: <HomeOutlined />,
            label: 'Dashboard',
          },
          {
            key: '2',
            icon: <SettingOutlined />,
            label: 'Settings',
          },
        ]}
      />
    </>
  );
};

export default Sidebar;