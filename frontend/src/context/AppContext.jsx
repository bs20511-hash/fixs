import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const ROLES = {
  ADMIN: { id: 1, name: 'Admin', label: 'ผู้ดูแลระบบ', avatar: '👨‍💼' },
  EXECUTIVE: { id: 2, name: 'Executive', label: 'ผู้บริหาร / ผู้อำนวยการ', avatar: '👔' },
  STAFF: { id: 3, name: 'Staff', label: 'ครู / เจ้าหน้าที่ผู้แจ้งซ่อม', avatar: '👩‍🏫' },
  TECHNICIAN: { id: 4, name: 'Technician', label: 'ช่างซ่อมบำรุง', avatar: '🛠️' }
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    id: "USR-003",
    name: "ครูสมชาย สายสอน",
    email: "teacher@maesariang.ac.th",
    role: ROLES.STAFF
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'new_request' | 'task_board' | 'assets' | 'audit'
  const [toast, setToast] = useState(null); // { type: 'success'|'error'|'info', message: '' }
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (message, type = 'success', duration = 3500) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const switchRole = (roleKey) => {
    const newRole = ROLES[roleKey];
    if (newRole) {
      let userName = "ครูสมชาย สายสอน";
      let userId = "USR-003";

      if (roleKey === 'ADMIN') { userName = "ผู้ดูแลระบบ (Admin)"; userId = "USR-001"; }
      else if (roleKey === 'EXECUTIVE') { userName = "ผอ.สมศักดิ์ นำวิทยาลัย"; userId = "USR-002"; }
      else if (roleKey === 'TECHNICIAN') { userName = "ช่างสมเกียรติ ซ่อมดี"; userId = "USR-004"; }

      setCurrentUser({
        id: userId,
        name: userName,
        email: `${roleKey.toLowerCase()}@maesariang.ac.th`,
        role: newRole
      });

      // Auto switch view tab based on role
      if (roleKey === 'TECHNICIAN') setActiveTab('task_board');
      else if (roleKey === 'STAFF') setActiveTab('new_request');
      else setActiveTab('dashboard');

      showToast(`สลับบทบาทการใช้งานเป็น: ${newRole.label}`, 'info');
    }
  };

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      switchRole,
      activeTab,
      setActiveTab,
      toast,
      showToast,
      isLoading,
      setIsLoading,
      isOnline,
      refreshKey,
      triggerRefresh
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
