# แผนงานและสถาปัตยกรรมระบบ GitNote (Online/Offline Note System)
**โครงการ:** GitNote System (GitHub + Google Sheets + Google Apps Script + Service Worker/IndexedDB)  
**วันที่บันทึก:** 14 สิงหาคม 2026  

---

## 🏗️ 1. ภาพรวมสถาปัตยกรรมระบบ (System Architecture)

```
[ Frontend Web App (GitHub Pages) ]
       │
       ├─► [ Local IndexedDB ] (เก็บข้อมูลเมื่อ Offline)
       ├─► [ Service Worker ] (Cache Assets / PWA)
       │
       ▼ (เมื่อมีสัญญาณ Internet / Auto Sync Engine)
 [ GAS Backend Web App API (Code.gs) ]
       │
       ├─► [ Google Sheets DB ] (เก็บข้อมูล Notes, Categories, Version History)
       ├─► [ Google Drive ] (เก็บไฟล์ภาพ และ Attachments)
       └─► [ GitHub Repository ] (ซิงก์ไฟล์ .md และ Commit History)
```

---

## 💡 2. คำอธิบายหลักการทำงาน (Core Architecture & Mechanics)

### 2.1 ระบบ Offline-First (ทำงานได้โดยไม่ต้องมีเน็ต)
- **Local DB (IndexedDB):** โน้ตทุกฉบับจะถูกบันทึกลงใน IndexedDB ของเบราว์เซอร์ก่อนเสมอ เพื่อให้ผู้ใช้เปิดอ่านและแก้ไขโน้ตได้ทันทีแม้อยู่ในโหมด Offline
- **Offline Sync Queue:** หากไม่มีสัญญาณอินเทอร์เน็ต รายการสร้าง/แก้ไข/ลบ จะถูกเก็บเข้าคิว (`pending_sync`)
- **Background Auto-Sync Engine:** ตรวจจับสัญญาณอินเทอร์เน็ต (`navigator.onLine`) เมื่อเน็ตกลับมาติด ระบบจะส่งรายการในคิวไปอัปเดตบน Google Sheets อัตโนมัติ พร้อมรองรับ Conflict Resolution

### 2.2 Google Sheets & Google Apps Script (GAS Engine)
- **Google Sheets เป็น Database:** จัดเก็บโครงสร้างโน้ต, หมวดหมู่ (Categories), แท็ก (Tags), และประวัติเวอร์ชัน (Note History)
- **Google Apps Script (GAS) เป็น REST API:** ใช้ `doGet` / `doPost` ร่วมกับ `LockService.getScriptLock()` ป้องกัน Data Collision เมื่อบันทึกพร้อมกัน

### 2.3 Google Drive Storage
- จัดเก็บภาพถ่าย และไฟล์แนบ (Attachments)
- GAS แปลงรูปภาพ Base64 จากหน้าเว็บขึ้น Google Drive และส่งคืน Direct Web View Link กลับมาแสดงผล

### 2.4 GitHub Integration (Deployment & Version Control)
- **GitHub Pages:** โฮสต์เว็บแอปพลิเคชันฝั่ง Frontend ฟรี มีความเร็วสูงและได้ HTTPS ปลอดภัย
- **Git Commit Backup:** ส่งออกโน้ตเป็นไฟล์ Markdown (`.md`) แล้ว Commit ลง GitHub Repository ผ่าน GitHub REST API เพื่อให้มี Commit Log ตามมาตรฐาน Git

---

## 📊 3. โครงสร้างฐานข้อมูล Google Sheets (Database Schema)

| Sheet Name | Key Columns | Description |
| :--- | :--- | :--- |
| **`notes`** | `id`, `title`, `content_md`, `category_id`, `tags`, `is_pinned`, `is_archived`, `is_deleted`, `created_at`, `updated_at`, `version` | ตารางหลักเก็บข้อมูลโน้ต |
| **`note_history`** | `id`, `note_id`, `version`, `title`, `content_md`, `updated_by`, `updated_at` | ตารางเก็บประวัติเวอร์ชันย้อนหลัง (Git-like Diff) |
| **`categories`** | `id`, `category_name`, `color_code`, `icon` | ตารางหมวดหมู่โน้ต |
| **`tags`** | `id`, `tag_name` | ตารางแท็กค้นหา |
| **`attachments`** | `id`, `note_id`, `drive_file_id`, `web_view_link`, `file_name`, `file_size`, `created_at` | ตารางเก็บไฟล์แนบใน Google Drive |
| **`sync_log`** | `id`, `client_id`, `action`, `note_id`, `status`, `timestamp` | ตาราง Audit Log สำหรับตรวจสอบการซิงก์ |

---

## 🛠️ 4. โครงสร้างไฟล์โปรเจกต์ (Project Directory Structure)

```
gitnote-system/
├── gas/                           # โค้ดส่วนหลังบ้าน Google Apps Script
│   ├── Code.gs                    # RESTful Action Router (doGet/doPost & CORS)
│   ├── Setup.gs                   # setupDatabase() สร้าง Sheets, Headers & Drive Folders
│   ├── SheetService.gs            # CRUD Helper สำหรับ Google Sheets
│   └── DriveService.gs            # จัดการอัปโหลดไฟล์ Base64 ลง Google Drive
│
├── frontend/                      # โค้ดส่วนหน้าบ้าน React + Vite PWA
│   ├── public/
│   │   └── sw.js                  # Service Worker สำหรับ Offline Access
│   ├── src/
│   │   ├── components/            # UI Components (NoteEditor, HistoryViewer, Sidebar)
│   │   ├── services/              # Client Services (db.js, syncEngine.js, githubService.js)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── README.md                      # อธิบายวิธีการติดตั้งและรันโปรเจกต์
└── gitnote_plan.md                # ไฟล์แผนงานสถาปัตยกรรมฉบับนี้
```

---

## 🚀 5. แผนการดำเนินงาน (Implementation Phases)

1. **Phase 1: GAS Backend & Sheet Setup** -> เขียนสคริปต์ `Setup.gs`, `Code.gs`, `SheetService.gs`, `DriveService.gs`
2. **Phase 2: Frontend & Offline Engine** -> พัฒนา React Web App, IndexedDB Storage, Service Worker และ Offline Sync Queue Engine
3. **Phase 3: Note Editor & Git History** -> พัฒนา Markdown Editor พร้อมรูปภาพ และ History Diff Viewer
4. **Phase 4: GitHub Integration & Deployment** -> ตั้งค่าซิงก์ไฟล์ลง GitHub Repo และ Deploy ขึ้น GitHub Pages
