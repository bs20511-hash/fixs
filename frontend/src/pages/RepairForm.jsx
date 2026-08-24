import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';
import { ImageDropzone } from '../components/ImageDropzone';
import { useApp } from '../context/AppContext';

export const RepairForm = () => {
  const { currentUser, showToast, setActiveTab, triggerRefresh } = useApp();
  const [assets, setAssets] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    asset_id: '',
    asset_name: '',
    building_name: 'อาคารวิทยบริการ',
    room_name: 'ห้องสมุด 201',
    urgency_level: 'MEDIUM',
    problem_description: '',
    image_base64: null
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    const list = await apiService.getAssets();
    setAssets(list);
    if (list.length > 0) {
      setFormData(prev => ({
        ...prev,
        asset_id: list[0].id,
        asset_name: list[0].asset_name
      }));
    }
  };

  const handleAssetSelect = (e) => {
    const selectedId = e.target.value;
    const item = assets.find(a => a.id === selectedId);
    setFormData(prev => ({
      ...prev,
      asset_id: selectedId,
      asset_name: item ? item.asset_name : selectedId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.problem_description.trim()) {
      showToast('กรุณาระบุอาการชำรุด', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiService.createRepairRequest({
        ...formData,
        reporter_id: currentUser.id,
        reporter_name: currentUser.name
      });

      if (res && res.status === 'SUCCESS') {
        showToast(`บันทึกการแจ้งซ่อมเรียบร้อย รหัสใบงาน: ${res.id}`, 'success');
        triggerRefresh();
        setActiveTab('dashboard');
      } else {
        showToast(res.message || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
      }
    } catch (err) {
      showToast('ไม่สามารถส่งใบแจ้งซ่อมได้', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-12 space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-900">แจ้งซ่อมอุปกรณ์ชำรุด</h2>
        <p className="text-sm text-slate-500">กรอกรายละเอียดอุปกรณ์และอาการชำรุดเพื่อส่งเรื่องให้ช่างดำเนินการ</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        
        {/* User Info Bar */}
        <div className="bg-brand-50/60 p-4 rounded-xl border border-brand-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-600 font-semibold uppercase tracking-wider block">ผู้แจ้งซ่อม</span>
            <span className="font-medium text-slate-800 text-sm">{currentUser.name} ({currentUser.role.label})</span>
          </div>
          <span className="text-xs text-slate-400">{new Date().toLocaleDateString('th-TH')}</span>
        </div>

        {/* Asset Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">เลือกครุภัณฑ์ / อุปกรณ์ *</label>
          <select
            value={formData.asset_id}
            onChange={handleAssetSelect}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                [{asset.id}] {asset.asset_name} ({asset.category})
              </option>
            ))}
          </select>
        </div>

        {/* Building & Room */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">อาคาร *</label>
            <input
              type="text"
              value={formData.building_name}
              onChange={(e) => setFormData({ ...formData, building_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="ระบุชื่ออาคาร"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">ห้อง *</label>
            <input
              type="text"
              value={formData.room_name}
              onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="ระบุชื่อห้อง"
              required
            />
          </div>
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">ระดับความเร่งด่วน *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'LOW', label: 'ต่ำ', desc: 'ซ่อมตามรอบ' },
              { id: 'MEDIUM', label: 'ปานกลาง', desc: 'กระทบการเรียน' },
              { id: 'HIGH', label: 'สูง', desc: 'ต้องรีบซ่อม' },
              { id: 'CRITICAL', label: 'วิกฤต', desc: 'อันตราย/ฉุกเฉิน' }
            ].map(level => (
              <button
                type="button"
                key={level.id}
                onClick={() => setFormData({ ...formData, urgency_level: level.id })}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.urgency_level === level.id
                    ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm">{level.label}</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Problem Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">อาการชำรุด / รายละเอียด *</label>
          <textarea
            rows="4"
            value={formData.problem_description}
            onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
            placeholder="อธิบายอาการเสียเบื้องต้น เช่น แอร์มีน้ำหยด, คอมเปิดไม่ติด มีเสียงร้องเตือน..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            required
          ></textarea>
        </div>

        {/* Image Dropzone */}
        <ImageDropzone
          onImageSelected={(base64) => setFormData({ ...formData, image_base64: base64 })}
          label="แนบรูปถ่ายอุปกรณ์ชำรุด (ก่อนซ่อม)"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {submitting ? (
            <span>กำลังบันทึกข้อมูล...</span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>บันทึกการแจ้งซ่อม</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
};
