import { openDB } from 'idb'; // ไลบรารีน้ำหนักเบาแนะนำสำหรับเปิดใช้งาน IndexedDB

const DB_NAME = 'maesariang_offline_db';

export async function initOfflineDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('repair_queue')) {
        db.createObjectStore('repair_queue', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

// ฟังก์ชันสำหรับดักจับตอนกดส่งฟอร์ม
export async function submitRepairForm(formData) {
  if (!navigator.onLine) {
    // หากเช็กแล้วว่าเน็ตของวิทยาลัยขัดข้องกลางคัน
    const db = await initOfflineDB();
    await db.add('repair_queue', { ...formData, timestamp: new Date() });
    alert('⚠️ สัญญาณอินเทอร์เน็ตขาดหาย! ระบบได้บันทึกฟอร์มและภาพถ่ายลงเครื่องคุณแล้ว และจะอัปโหลดอัตโนมัติเมื่อเน็ตกลับมาทำงาน');
    return { status: 'OFFLINE_QUEUED' };
  }

  // หากเน็ตปกติ ส่งเข้า API หลังบ้านโดยตรง
  return fetch('/api/repair/create', { method: 'POST', body: JSON.stringify(formData) });
}

// ระบบภูมิคุ้มกันเช็กสัญญาณเน็ตอัตโนมัติ (Background Sync)
window.addEventListener('online', async () => {
  const db = await initOfflineDB();
  const allQueuedTasks = await db.getAll('repair_queue');

  if (allQueuedTasks.length > 0) {
    console.log(`📡 เน็ตกลับมาออนไลน์แล้ว! กำลังซิงค์ข้อมูลค้างส่งจำนวน ${allQueuedTasks.length} รายการ...`);
    for (const task of allQueuedTasks) {
      try {
        const res = await fetch('/api/repair/create', { method: 'POST', body: JSON.stringify(task) });
        if (res.ok) {
          await db.delete('repair_queue', task.id); // ซิงค์ผ่านแล้ว ลบคิวขยะในเบราว์เซอร์ออก
        }
      } catch (err) {
        console.error('การซิงค์ข้อมูลล้มเหลวชั่วคราว รอรอบถัดไป', err);
      }
    }
  }
});