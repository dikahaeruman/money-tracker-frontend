'use client';

import React, { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import { Button } from '@/components/ui/button';
import { MenuIcon, PanelLeftCloseIcon } from 'lucide-react';
import CustomHeader from '@/app/components/CustomHeader';
import SettingsContent from '@/app/components/SettingsContent';
import DashboardContent from '@/app/components/dashboard/DashboardContent';
import { useUser } from '@/contexts/UserContext';
import { Spinner } from '@/components/ui/spinner';

const Dashboard = () => {
  const [currentContent, setCurrentContent] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const { user, setUser, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
      <Spinner size="lg" />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentContent) {
      case 'dashboard':
        return <DashboardContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen">
    <aside className={`bg-background border-r h-screen sticky top-0 overflow-hidden ${
      collapsed ? 'w-20' : 'w-64'
    } transition-all duration-300`}>
      <Sidebar collapsed={collapsed} onMenuSelect={setCurrentContent} />
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 left-4 h-10 w-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <MenuIcon size={20} /> : <PanelLeftCloseIcon size={20} />}
      </Button>
    </aside>
      <div className="flex-1">
        <header className="bg-muted/50 border-b h-16">
          <CustomHeader />
        </header>
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;