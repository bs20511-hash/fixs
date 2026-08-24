# 1. โครงสร้างฐานข้อมูล (Cloudflare D1 SQL Schema)
> บันทึกไฟล์นี้เป็น `schema.sql` แล้วใช้คำสั่ง `npx wrangler d1 execute maesariang_repair_db --file=./schema.sql`

```sql
-- 1. ตารางสิทธิ์การใช้งาน (RBAC Roles)
CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT NOT NULL UNIQUE
);

INSERT INTO roles (role_name) VALUES ('Admin'), ('Executive'), ('Staff'), ('Technician');

-- 2. ตารางข้อมูลผู้ใช้งาน (Users)
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- UUID หรือ Google Provider ID
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT, -- สำหรับบัญชีทั่วไปที่แฮชด้วย bcrypt/argon2id
    full_name TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    is_active INTEGER DEFAULT 1, -- 1 = ปกติ, 0 = บล็อกสิทธิ์
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE INDEX idx_users_email ON users(email);

-- 3. ตารางอาคารเรียน (Buildings)
CREATE TABLE buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_name TEXT NOT NULL UNIQUE
);

-- 4. ตารางห้องเรียน/ห้องปฏิบัติการ (Rooms)
CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_name TEXT NOT NULL,
    building_id INTEGER NOT NULL,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

-- 5. ตารางครุภัณฑ์และอุปกรณ์ (Assets)
CREATE TABLE assets (
    id TEXT PRIMARY KEY, -- เลขครุภัณฑ์ เช่น "คพ.65-001"
    asset_name TEXT NOT NULL,
    category TEXT NOT NULL,
    room_id INTEGER NOT NULL,
    is_deleted INTEGER DEFAULT 0, -- 0 = ปกติ, 1 = ลบชั่วคราว (Soft Delete)
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE INDEX idx_assets_search ON assets(asset_name, is_deleted);

-- 6. ตารางหลักการแจ้งซ่อม (Repair Requests)
CREATE TABLE repair_requests (
    id TEXT PRIMARY KEY, -- รหัสรันอัตโนมัติ เช่น "REP-2026-0001"
    reporter_id TEXT NOT NULL,
    asset_id TEXT NOT NULL,
    urgency_level TEXT CHECK(urgency_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) NOT NULL,
    problem_description TEXT NOT NULL,
    status TEXT CHECK(status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_PARTS', 'DONE', 'CLOSED', 'CANCELLED')) DEFAULT 'PENDING',
    assigned_technician_id TEXT,
    is_deleted INTEGER DEFAULT 0, -- Soft Delete ป้องกันแอดมินหรือช่างกดพลาด
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (assigned_technician_id) REFERENCES users(id)
);

CREATE INDEX idx_repair_status ON repair_requests(status, is_deleted);

-- 7. ตารางบันทึกประวัติสถานะ (Repair History / Timeline)
CREATE TABLE repair_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repair_request_id TEXT NOT NULL,
    status_changed_to TEXT NOT NULL,
    notes TEXT,
    changed_by TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (repair_request_id) REFERENCES repair_requests(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- 8. ตารางเชื่อมโยงรูปภาพบน Google Drive (Repair Images)
CREATE TABLE repair_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repair_request_id TEXT NOT NULL,
    google_drive_file_id TEXT NOT NULL,
    web_view_link TEXT NOT NULL,
    image_type TEXT CHECK(image_type IN ('BEFORE', 'AFTER')) NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (repair_request_id) REFERENCES repair_requests(id)
);

CREATE INDEX idx_images_date ON repair_images(created_at);

-- 9. ตารางจัดเก็บล็อกความปลอดภัย (Audit Logs - Append Only ห้ามลบ)
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    action TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);