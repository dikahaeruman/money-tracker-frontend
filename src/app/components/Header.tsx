import React from 'react';

type HeaderProps = {
  title: string;
  user: string;
  status: string;
};

const Header: React.FC<HeaderProps> = ({ title, user, status }) => {
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
            <p className="profile-name">{user}</p>
            <p className="profile-status">{status}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;