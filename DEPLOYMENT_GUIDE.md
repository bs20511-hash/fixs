# 📘 คู่มือการติดตั้งและเปิดใช้งานระบบ (Deployment Guide)
**ระบบเว็บแอปพลิเคชันแจ้งอุปกรณ์ชำรุด วิทยาลัยการอาชีพแม่สะเรียง**

---

## 🛠️ ขั้นตอนที่ 1: การตั้งค่า Backend (Google Apps Script - GAS)

1. เปิดเบราว์เซอร์ไปที่ Google Spreadsheet:
   `https://docs.google.com/spreadsheets/d/1unFgUFViMqjwnRkam6ru6knO6-dcpBMdmzwtMqMEAJY/edit`
2. คลิกเมนู **ส่วนขยาย (Extensions)** -> **Apps Script**
3. สร้างไฟล์ `.gs` จำนวน 4 ไฟล์ ตามโค้ดที่เตรียมไว้ในโฟลเดอร์ `/gas`:
   - `Setup.gs`
   - `Code.gs`
   - `SheetService.gs`
   - `DriveService.gs`
4. **สั่งรันสร้างฐานข้อมูลครั้งแรก:**
   - ที่แถบเมนูด้านบน เลือกฟังก์ชัน `setupDatabase`
   - กดปุ่ม **เรียกใช้งาน (Run)**
   - สคริปต์จะทำการสร้างและจัดฟอร์แมต 9 Sheet พร้อมโฟลเดอร์ใน Google Drive อัตโนมัติ!

---

## 🚀 ขั้นตอนที่ 2: การ Deploy GAS เป็น Web App API

1. ในหน้า Apps Script กดปุ่ม **ทำให้ใช้งานได้อย่างรวดเร็ว (Deploy)** -> **การทำให้ใช้งานได้รายการใหม่ (New Deployment)**
2. คลิกไอคอนรูปเฟือง ⚙️ เลือก **เว็บแอป (Web App)**
3. ตั้งค่าดังนี้:
   - **รายละเอียด (Description):** `Mae Sariang Repair API v1.0`
   - **ผู้ใช้ที่ดำเนินการในนามของ (Execute as):** `ฉัน (Me)`
   - **ผู้ที่มีสิทธิ์เข้าถึง (Who has access):** `ทุกคน (Anyone)`
4. กด **ทำให้ใช้งานได้ (Deploy)** และให้สิทธิ์สคริปต์ (Grant Permissions)
5. คัดลอก **URL เว็บแอป (Web App URL)** ที่ได้ นำไปใส่ในไฟล์ `frontend/src/services/api.js` ที่ตัวแปร `GAS_WEB_APP_URL`

---

## 🖥️ ขั้นตอนที่ 3: การรันและสร้าง Frontend (Web Application)

### การรันบนเครื่องคอมพิวเตอร์ (Local Development)
1. เปิด Terminal ในโฟลเดอร์ `frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

### การสร้าง Production Bundle และขึ้น GitHub Pages / Cloudflare Pages
```bash
npm run build
```
นำไฟล์ทั้งหมดในโฟลเดอร์ `dist` ไปอัปโหลดขึ้น GitHub Pages หรือ Cloudflare Pages ได้ทันที!
