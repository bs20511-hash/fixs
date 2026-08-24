import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, Wrench, CheckCircle2, Search, Filter, RefreshCw, Eye } from 'lucide-react';
import { apiService } from '../services/api';
import { StatusBadge, UrgencyBadge } from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';

export const Dashboard = () => {
  const { showToast, refreshKey } = useApp();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [refreshKey]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, requestsData] = await Promise.all([
        apiService.getStats(),
        apiService.getRepairRequests()
      ]);
      setStats(statsData);
      setRequests(requestsData);
    } catch (err) {
      showToast('ไม่สามารถดึงข้อมูลสถิติได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      (req.id && req.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.asset_name && req.asset_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.problem_description && req.problem_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.building_name && req.building_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">ภาพรวมระบบและสถิติ</h2>
          <p className="text-sm text-slate-500">รายงานสรุปรายการแจ้งซ่อมอุปกรณ์ วิทยาลัยการอาชีพแม่สะเรียง</p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          <span>รีเฟรชข้อมูล</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">แจ้งซ่อมทั้งหมด</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">รายการแจ้งซ่อมทั้งหมดในระบบ</div>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">รอดำเนินการ</p>
              <h3 className="text-3xl font-bold text-amber-900 mt-1">{stats.pending}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-amber-600 font-medium">รอช่างเข้ามารับงาน</div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">กำลังดำเนินการ</p>
              <h3 className="text-3xl font-bold text-blue-900 mt-1">{stats.inProgress}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-blue-600 font-medium">ช่างกำลังซ่อม / รออะไหล่</div>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">ซ่อมเสร็จสิ้น</p>
              <h3 className="text-3xl font-bold text-emerald-900 mt-1">{stats.completed}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-600 font-medium">ปิดงานเสร็จสมบูรณ์</div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="ค้นหาเลขใบงาน, อาคาร, อาการ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'DONE'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status === 'ALL' && 'ทั้งหมด'}
              {status === 'PENDING' && 'รอดำเนินการ'}
              {status === 'IN_PROGRESS' && 'กำลังซ่อม'}
              {status === 'DONE' && 'ซ่อมเสร็จ'}
            </button>
          ))}
        </div>

      </div>

      {/* Recent Repair Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">รายการแจ้งซ่อมล่าสุด</h3>
          <span className="text-xs text-slate-400">แสดง {filteredRequests.length} จาก {requests.length} รายการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">เลขที่ใบงาน</th>
                <th className="px-6 py-3.5">วันที่แจ้ง</th>
                <th className="px-6 py-3.5">สถานที่ (อาคาร/ห้อง)</th>
                <th className="px-6 py-3.5">ครุภัณฑ์ / อาการชำรุด</th>
                <th className="px-6 py-3.5">ความเร่งด่วน</th>
                <th className="px-6 py-3.5">สถานะ</th>
                <th className="px-6 py-3.5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    ไม่พบรายการแจ้งซ่อม
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{req.id}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{req.date || req.created_at}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{req.building_name}</div>
                      <div className="text-xs text-slate-400">{req.room_name}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-medium text-slate-800 truncate">{req.asset_name}</div>
                      <div className="text-xs text-slate-500 truncate">{req.problem_description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <UrgencyBadge level={req.urgency_level} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedItem(req)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>รายละเอียด</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={`รายละเอียดใบงาน: ${selectedItem?.id}`}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-xs text-slate-400 block">ผู้แจ้งซ่อม</span>
                <span className="font-medium text-slate-800">{selectedItem.reporter_name}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">ช่างผู้รับผิดชอบ</span>
                <span className="font-medium text-slate-800">{selectedItem.technician_name || 'ยังไม่ระบุ'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">สถานที่</span>
                <span className="font-medium text-slate-800">{selectedItem.building_name} ({selectedItem.room_name})</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">ระดับความเร่งด่วน</span>
                <UrgencyBadge level={selectedItem.urgency_level} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">อาการชำรุด</h4>
              <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200">{selectedItem.problem_description}</p>
            </div>

            {selectedItem.images && selectedItem.images.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">รูปถ่ายแนบ</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedItem.images.map((img, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200">
                      <img src={img.web_view_link} alt="Attachment" className="w-full h-32 object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                        {img.image_type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};
