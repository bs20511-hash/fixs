# 🏫 ระบบเว็บแอปพลิเคชันแจ้งอุปกรณ์ชำรุด วิทยาลัยการอาชีพแม่สะเรียง
**(Mae Sariang Industrial and Community Education College Equipment Repair Notification System)**

---

## 🌟 ฟีเจอร์สำคัญของระบบ (Key Features)

1. **Dashboard & Executive Analytics:**
   - สรุป 4 KPI Cards (แจ้งซ่อมทั้งหมด, รอดำเนินการ, กำลังซ่อม, ซ่อมเสร็จ)
   - ตารางรายการแจ้งซ่อมพร้อมระบบค้นหาและกรองสถานะ
2. **Repair Request Form (หน้าแจ้งซ่อม):**
   - ฟอร์มเลือกครุภัณฑ์, อาคาร, ห้อง, ระดับความเร่งด่วน
   - Dropzone แนบรูปถ่ายอุปกรณ์ชำรุด (BEFORE photo) พร้อมบีบอัดและแสดงผลลัพธ์
3. **Technician Task Board (กระดานงานช่างซ่อม):**
   - แสดงการ์ดงานช่าง พร้อมปุ่มกดรับงาน
   - โมดูลอัปเดตสถานะการซ่อม บันทึกวิธีแก้ไข และแนบรูปหลังซ่อมเสร็จ (AFTER photo)
4. **Clean Architecture & Auto-Database Engine:**
   - สคริปต์ Google Apps Script (GAS) เนรมิต 9 Sheet Tables และ 2 Google Drive Folders อัตโนมัติ
   - มีระบบ `LockService` ป้องกันข้อมูลชนกันเมื่อมีการเขียนพร้อมกัน
   - ระบบ Client API พร้อม Exponential Backoff Retry Mechanism และ Offline Fallback

---

## 📂 โครงสร้างโปรเจกต์ (Project Directory Structure)

```
d:/งานกลุ่มเทคโน/
├── gas/                           # ⚙️ โค้ดหลังบ้าน Google Apps Script Engine
│   ├── Code.gs                    # RESTful API Action Router & CORS Builder
│   ├── Setup.gs                   # setupDatabase() เนรมิต 9 Sheets & Drive Folders
│   ├── SheetService.gs            # CRUD operations สำหรับ Google Sheets
│   └── DriveService.gs            # อัปโหลดรูปภาพ Base64 ลงใน Google Drive
│
├── frontend/                      # 🖥️ โค้ดหน้าบ้าน Web Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/            # Navbar, Sidebar, StatusBadge, Toast, Modal, ImageDropzone
│   │   ├── context/               # AppContext State & Role Switcher
│   │   ├── pages/                 # Dashboard, RepairForm, TaskBoard, AssetManager, AuditLogs
│   │   ├── services/              # api.js Client Service พร้อม Retry Mechanism
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md            # 📘 คู่มือตั้งค่าและ Deploy ระบบแบบทีละขั้นตอน
├── WORK_LOG.md                    # 📋 บันทึกประวัติการพัฒนาโปรเจกต์
└── README.md                      # ℹ️ คำอธิบายภาพรวมโปรเจกต์
```
