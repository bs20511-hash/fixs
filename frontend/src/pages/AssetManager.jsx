import React, { useState, useEffect } from 'react';
import { Package, Search, Plus } from 'lucide-react';
import { apiService } from '../services/api';

export const AssetManager = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    const data = await apiService.getAssets();
    setAssets(data);
    setLoading(false);
  };

  const filteredAssets = assets.filter(a =>
    a.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">จัดการข้อมูลครุภัณฑ์</h2>
          <p className="text-sm text-slate-500">ตารางค้นหาและตรวจสอบรายการอุปกรณ์ทั้งหมดในวิทยาลัย</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="ค้นหารหัส หรือ ชื่อครุภัณฑ์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">เลขครุภัณฑ์</th>
                <th className="px-6 py-3.5">ชื่อครุภัณฑ์ / อุปกรณ์</th>
                <th className="px-6 py-3.5">หมวดหมู่</th>
                <th className="px-6 py-3.5">รหัสห้องที่ติดตั้ง</th>
                <th className="px-6 py-3.5">สถานะการใช้งาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400">กำลังโหลดรายการครุภัณฑ์...</td></tr>
              ) : filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-semibold text-slate-900">{asset.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{asset.asset_name}</td>
                  <td className="px-6 py-4"><span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs">{asset.category}</span></td>
                  <td className="px-6 py-4 text-xs text-slate-500">ห้อง ID: {asset.room_id}</td>
                  <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">ปกติพร้อมใช้งาน</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
