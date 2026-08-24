import React from 'react';

export const StatusBadge = ({ status }) => {
  const config = {
    PENDING: { label: 'รอดำเนินการ', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
    ASSIGNED: { label: 'มอบหมายช่างแล้ว', bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200', dot: 'bg-sky-500' },
    IN_PROGRESS: { label: 'กำลังดำเนินการ', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', dot: 'bg-blue-600' },
    WAITING_PARTS: { label: 'รออะไหล่', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-500' },
    DONE: { label: 'ซ่อมเสร็จสิ้น', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-600' },
    CLOSED: { label: 'ปิดใบงาน', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', dot: 'bg-slate-500' },
    CANCELLED: { label: 'ยกเลิก', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200', dot: 'bg-rose-500' }
  };

  const current = config[status] || { label: status, bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200', dot: 'bg-slate-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${current.bg} ${current.text} ${current.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
  );
};

export const UrgencyBadge = ({ level }) => {
  const config = {
    LOW: { label: 'ต่ำ', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
    MEDIUM: { label: 'ปานกลาง', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    HIGH: { label: 'สูง', bg: 'bg-orange-50 text-orange-700 border-orange-200 font-semibold' },
    CRITICAL: { label: 'วิกฤต', bg: 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse-subtle' }
  };

  const current = config[level] || { label: level, bg: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs border ${current.bg}`}>
      {current.label}
    </span>
  );
};
