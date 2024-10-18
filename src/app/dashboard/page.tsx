"use client"
import React from 'react';
import 'styles/dashboard.css';
import Header from '../components/Header';
import AccountPocket from './AccountPocket';
import DashboardCards from './DashboardCard';


const Dashboard = () => {

  return (
    <>
      <Header title="Dashboard" user="Ilyas Abduttawab" status="Premium" />
      <AccountPocket></AccountPocket>
      <DashboardCards></DashboardCards>
    </>
  );
};

export default Dashboard;