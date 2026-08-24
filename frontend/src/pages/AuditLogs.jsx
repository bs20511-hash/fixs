import React from 'react';
import { ShieldAlert, Activity } from 'lucide-react';

export const AuditLogs = () => {
  const sampleLogs = [
    { id: 1, user_id: 'USR-003', action: 'CREATE_REPAIR_REP-2026-0001', ip: '192.168.1.45', date: '2026-08-01 09:00:00' },
    { id: 2, user_id: 'USR-004', action: 'UPDATE_STATUS_IN_PROGRESS', ip: '192.168.1.88', date: '2026-08-02 11:00:00' },
    { id: 3, user_id: 'USR-005', action: 'UPDATE_STATUS_DONE', ip: '192.168.1.92', date: '2026-08-04 16:00:00' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">บันทึกกิจกรรมความปลอดภัย (Audit Logs)</h2>
        <p className="text-sm text-slate-500">ประวัติการทำรายการในระบบแบบ Append-only (ป้องกันการแก้ไขหรือลบ)</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-3.5">ID</th>
              <th className="px-6 py-3.5">ผู้ทำรายการ</th>
              <th className="px-6 py-3.5">การกระทำ (Action)</th>
              <th className="px-6 py-3.5">IP Address</th>
              <th className="px-6 py-3.5">วัน-เวลา</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sampleLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 font-mono text-xs">{log.id}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{log.user_id}</td>
                <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 font-mono text-xs text-brand-700 rounded">{log.action}</span></td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{log.ip}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
