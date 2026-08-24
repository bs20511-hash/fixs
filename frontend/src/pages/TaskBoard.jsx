import React, { useState, useEffect } from 'react';
import { CheckSquare, Wrench, Clock, CheckCircle2, AlertTriangle, RefreshCw, Upload } from 'lucide-react';
import { apiService } from '../services/api';
import { StatusBadge, UrgencyBadge } from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { ImageDropzone } from '../components/ImageDropzone';

export const TaskBoard = () => {
  const { currentUser, showToast, refreshKey, triggerRefresh } = useApp();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [updateModalData, setUpdateModalData] = useState({
    status: 'IN_PROGRESS',
    notes: '',
    image_base64: null
  });

  useEffect(() => {
    loadTasks();
  }, [refreshKey]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const list = await apiService.getRepairRequests();
      setTasks(list);
    } catch (e) {
      showToast('ไม่สามารถดึงข้อมูลรายการงานซ่อมได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (task) => {
    try {
      const res = await apiService.updateRepairStatus({
        id: task.id,
        status: 'IN_PROGRESS',
        technician_id: currentUser.id,
        technician_name: currentUser.name,
        notes: `ช่าง ${currentUser.name} รับงานเข้าซ่อมบำรุง`
      });

      if (res && res.status === 'SUCCESS') {
        showToast(`รับงานซ่อม ${task.id} เรียบร้อยแล้ว`, 'success');
        triggerRefresh();
      }
    } catch (e) {
      showToast('เกิดข้อผิดพลาดในการรับงาน', 'error');
    }
  };

  const openUpdateModal = (task) => {
    setSelectedTask(task);
    setUpdateModalData({
      status: task.status === 'PENDING' ? 'IN_PROGRESS' : 'DONE',
      notes: '',
      image_base64: null
    });
  };

  const handleSaveStatusUpdate = async () => {
    if (!selectedTask) return;
    setUpdating(true);

    try {
      const res = await apiService.updateRepairStatus({
        id: selectedTask.id,
        status: updateModalData.status,
        notes: updateModalData.notes,
        image_base64: updateModalData.image_base64,
        technician_id: currentUser.id,
        technician_name: currentUser.name
      });

      if (res && res.status === 'SUCCESS') {
        showToast(`อัปเดตสถานะใบงาน ${selectedTask.id} สำเร็จ`, 'success');
        setSelectedTask(null);
        triggerRefresh();
      }
    } catch (e) {
      showToast('ไม่สามารถอัปเดตสถานะได้', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">กระดานงานซ่อมบำรุง (Technician Task Board)</h2>
          <p className="text-sm text-slate-500">จัดการรายการงานซ่อม อัปเดตสถานะ และแนบรูปถ่ายหลังซ่อมเสร็จ</p>
        </div>
        <button
          onClick={loadTasks}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          <span>รีเฟรชงาน</span>
        </button>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">กำลังโหลดรายการงานช่าง...</div>
        ) : tasks.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">ไม่มีรายการงานซ่อมในระบบ</div>
        ) : (
          tasks.map((task) => {
            const beforeImage = task.images && task.images.find(img => img.image_type === 'BEFORE');
            const afterImage = task.images && task.images.find(img => img.image_type === 'AFTER');

            return (
              <div key={task.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                
                {/* Header Badge */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{task.id}</span>
                  <div className="flex items-center gap-2">
                    <UrgencyBadge level={task.urgency_level} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3 flex-1">
                  
                  {/* Image Placeholder / Uploaded Image */}
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60">
                    <img
                      src={afterImage ? afterImage.web_view_link : (beforeImage ? beforeImage.web_view_link : "https://picsum.photos/600/400?random=4")}
                      alt="Task Asset"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded">
                      {afterImage ? 'รูปหลังซ่อม (AFTER)' : 'รูปก่อนซ่อม (BEFORE)'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-base">{task.asset_name}</h4>
                    <p className="text-xs text-brand-600 font-medium">{task.building_name} - {task.room_name}</p>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {task.problem_description}
                  </p>

                  <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                    <span>ผู้แจ้ง: {task.reporter_name}</span>
                    <span>{task.date || task.created_at?.split(' ')[0]}</span>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                  {task.status === 'PENDING' ? (
                    <button
                      onClick={() => handleAcceptTask(task)}
                      className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/20 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>รับงานซ่อม</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openUpdateModal(task)}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>อัปเดตสถานะ / ส่งงาน</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={`อัปเดตสถานะการซ่อม: ${selectedTask?.id}`}
      >
        {selectedTask && (
          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">เลือกสถานะใหม่ *</label>
              <select
                value={updateModalData.status}
                onChange={(e) => setUpdateModalData({ ...updateModalData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="IN_PROGRESS">กำลังดำเนินการ (IN_PROGRESS)</option>
                <option value="WAITING_PARTS">รอสั่งอะไหล่ (WAITING_PARTS)</option>
                <option value="DONE">ซ่อมเสร็จสิ้น (DONE)</option>
                <option value="CLOSED">ปิดใบงาน (CLOSED)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">หมายเหตุการซ่อม / บันทึกการแก้ไข</label>
              <textarea
                rows="3"
                value={updateModalData.notes}
                onChange={(e) => setUpdateModalData({ ...updateModalData, notes: e.target.value })}
                placeholder="ระบุสิ่งที่แก้ไข เช่น เปลี่ยนสายไฟ, ทำความสะอาดแอร์..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              ></textarea>
            </div>

            <ImageDropzone
              onImageSelected={(base64) => setUpdateModalData({ ...updateModalData, image_base64: base64 })}
              label="แนบรูปถ่ายหลักฐานการซ่อมเสร็จ (AFTER)"
            />

            <button
              onClick={handleSaveStatusUpdate}
              disabled={updating}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {updating ? 'กำลังอัปเดต...' : 'บันทึกการอัปเดตสถานะ'}
            </button>

          </div>
        )}
      </Modal>

    </div>
  );
};
