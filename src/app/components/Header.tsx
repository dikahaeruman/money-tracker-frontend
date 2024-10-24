'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Popover, Button, Avatar, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useUser } from '@/contexts/UserContext';
import { logout } from '@/services/authServices';

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      message.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      message.error('Logout failed. Please try again.');
    }
  };

  const profileMenu = (
    <div>
      <Button 
        type="text" 
        icon={<LogoutOutlined />} 
        onClick={handleLogout}
        block
      >
        Logout
      </Button>
    </div>
  );

  return (
    <header className="header">
      <div className="logo">
        <div className="icon-container">
          <i className="fas fa-wallet icon"></i>
        </div>
        <h1 className="title">{title}</h1>
      </div>
      <div className="actions">
        <button className="record-btn">+ Record</button>
        <Popover content={profileMenu} trigger="click" placement="bottomRight">
          <div className="profile" style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} className="profile-pic" />
            <div className="profile-info">
              <p className="profile-name">{user?.username || 'Guest'}</p>
              <p className="profile-status"></p>
            </div>
          </div>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
