import React, { useState } from 'react';
import { Wrench, Wifi, WifiOff, ChevronDown, UserCheck, Shield } from 'lucide-react';
import { useApp, ROLES } from '../context/AppContext';

export const Navbar = () => {
  const { currentUser, switchRole, isOnline } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & College Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
              วิทยาลัยการอาชีพแม่สะเรียง
            </h1>
            <p className="text-xs text-brand-600 font-medium hidden sm:block">
              ระบบแจ้งซ่อมและบำรุงรักษาอุปกรณ์ชำรุด
            </p>
          </div>
        </div>

        {/* Status Indicator & User Profile Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Network Status Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isOnline ? 'เชื่อมต่อออนไลน์' : 'ออฟไลน์ (Offline)'}</span>
          </div>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 bg-slate-50 hover:bg-white transition-all shadow-sm"
            >
              <span className="text-lg">{currentUser.role.avatar}</span>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                <div className="text-[10px] text-brand-600 font-medium">{currentUser.role.label}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  จำลองสลับบทบาทการใช้งาน
                </div>
                {Object.keys(ROLES).map((key) => {
                  const role = ROLES[key];
                  const isSelected = currentUser.role.id === role.id;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        switchRole(key);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-brand-50/50 text-brand-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{role.avatar}</span>
                        <span>{role.label}</span>
                      </div>
                      {isSelected && <UserCheck className="w-4 h-4 text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
