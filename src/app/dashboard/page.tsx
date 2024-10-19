import React from 'react';
import 'styles/dashboard.css';
import AccountPocket from './AccountPocket';
import DashboardCards from './DashboardCard';


const Dashboard = () => {

  return (
    <>
      <AccountPocket></AccountPocket>
      <DashboardCards></DashboardCards>
    </>
  );
};

export default Dashboard;