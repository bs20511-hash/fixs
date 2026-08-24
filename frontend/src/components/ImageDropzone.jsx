import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Camera } from 'lucide-react';

export const ImageDropzone = ({ onImageSelected, label = "แนบรูปถ่ายอุปกรณ์ชำรุด" }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      if (onImageSelected) onImageSelected(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(null);
    if (onImageSelected) onImageSelected(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover max-h-56" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-brand-50/30 transition-all group cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-brand-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              คลิกหรือลากรูปภาพมาวางที่นี่
            </p>
            <p className="text-xs text-slate-400">
              รองรับไฟล์ PNG, JPG, WEBP (ไม่เกิน 5MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
