'use client';
import React from 'react';
import { useUser } from '@/contexts/UserContext';

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useUser();
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
        <div className="profile">
          <div className="profile-pic" />
          <div className="profile-info">
            <p className="profile-name">{user?.username || 'Guest'}</p>
            <p className="profile-status"></p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;