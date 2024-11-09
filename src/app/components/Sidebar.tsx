import React from 'react';
import { Flex, Menu, MenuProps } from 'antd';
import {
  HomeOutlined,
  RocketOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onMenuSelect: (key: string) => void;
}

const Sidebar : React.FC<SidebarProps> = ({onMenuSelect}) => {
  const handleMenuSelect = (key: string) => {
    onMenuSelect(key);
  }

  const onClick: MenuProps['onClick'] = ({key}) => {
    handleMenuSelect(key);
  };

  return (
    <>
      <Flex align="center" justify="center">
        <div className={styles.logo}>
          <RocketOutlined />
        </div>
      </Flex>

      <Menu
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        className={styles.menuBar}
        onClick={onClick}
        items={[
          {
            key: 'dashboard',
            icon: <HomeOutlined />,
            label: 'Dashboard',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
          },
        ]}
      />
    </>
  );
};

export default Sidebar;