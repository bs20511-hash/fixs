import React from 'react';
import { LayoutDashboard, PlusCircle, ClipboardList, Package, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'หน้าหลักและสถิติ', icon: LayoutDashboard, roles: ['Admin', 'Executive', 'Staff', 'Technician'] },
    { id: 'new_request', label: 'แจ้งซ่อมอุปกรณ์', icon: PlusCircle, roles: ['Admin', 'Staff', 'Executive', 'Technician'] },
    { id: 'task_board', label: 'กระดานงานช่าง', icon: ClipboardList, roles: ['Admin', 'Technician'] },
    { id: 'assets', label: 'จัดการครุภัณฑ์', icon: Package, roles: ['Admin', 'Executive'] },
    { id: 'audit', label: 'บันทึกระบบ (Audit Log)', icon: ShieldAlert, roles: ['Admin'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(currentUser.role.name));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 space-y-2 shrink-0">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          เมนูหลัก
        </div>
        <nav className="space-y-1">
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex justify-around shadow-lg">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive ? 'text-brand-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
