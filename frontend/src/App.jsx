import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';

import { Dashboard } from './pages/Dashboard';
import { RepairForm } from './pages/RepairForm';
import { TaskBoard } from './pages/TaskBoard';
import { AssetManager } from './pages/AssetManager';
import { AuditLogs } from './pages/AuditLogs';

const MainLayout = () => {
  const { activeTab } = useApp();

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'new_request':
        return <RepairForm />;
      case 'task_board':
        return <TaskBoard />;
      case 'assets':
        return <AssetManager />;
      case 'audit':
        return <AuditLogs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {renderView()}
        </main>
      </div>
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
