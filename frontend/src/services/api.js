/**
 * api.js - Client API Service สำหรับเชื่อมต่อ Google Apps Script Backend
 * พร้อมระบบ Retry Mechanism (Exponential Backoff) และ Fallback Mock Data
 */

// Deployment URL ของ GAS Web App
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwd6dHLSMx9UpUKpTHX9vIgasqHoStBd3guUiWXYM80kmMIndORewrWPf2Pef12Qx4FKQ/exec";

// Fallback Mock Data สำหรับพัฒนาแบบ Offline หรือขณะทดสอบ
const MOCK_DATA = {
  stats: {
    total: 125,
    pending: 12,
    inProgress: 5,
    completed: 108
  },
  requests: [
    {
      id: "REP-2026-0001",
      date: "2026-08-01 09:00:00",
      created_at: "2026-08-01 09:00:00",
      asset_id: "คพ.65-001",
      asset_name: "เครื่องปรับอากาศ York 18000 BTU",
      building_name: "อาคารวิทยบริการ",
      room_name: "ห้องสมุด 201",
      problem_description: "แอร์ไม่เย็น มีน้ำหยดลงพื้นห้องสมุด",
      urgency_level: "HIGH",
      status: "PENDING",
      reporter_name: "ครูสมชาย สายสอน",
      technician_name: "",
      images: [{ web_view_link: "https://picsum.photos/600/400?random=1", image_type: "BEFORE" }]
    },
    {
      id: "REP-2026-0002",
      date: "2026-08-02 10:30:00",
      created_at: "2026-08-02 10:30:00",
      asset_id: "คอม-64-012",
      asset_name: "เครื่องคอมพิวเตอร์ All-in-One Dell",
      building_name: "อาคารปฏิบัติการคอมพิวเตอร์",
      room_name: "Lab 3 คอมพิวเตอร์",
      problem_description: "เปิดไม่ติด หน้าจอมืด มีเสียงร้องดัง continuous beep",
      urgency_level: "CRITICAL",
      status: "IN_PROGRESS",
      reporter_name: "ครูสมชาย สายสอน",
      technician_name: "ช่างสมเกียรติ ซ่อมดี",
      images: [{ web_view_link: "https://picsum.photos/600/400?random=2", image_type: "BEFORE" }]
    },
    {
      id: "REP-2026-0003",
      date: "2026-08-03 14:15:00",
      created_at: "2026-08-03 14:15:00",
      asset_id: "โต๊ะ-60-005",
      asset_name: "โต๊ะเรียนนักศึกษาไม้สัก",
      building_name: "อาคารเรียน 1",
      room_name: "ห้อง 104",
      problem_description: "ขาโต๊ะหัก น็อตยึดหลุด 1 ตัว",
      urgency_level: "LOW",
      status: "DONE",
      reporter_name: "ครูสมชาย สายสอน",
      technician_name: "ช่างวิชัย ไวไฟ",
      images: [{ web_view_link: "https://picsum.photos/600/400?random=3", image_type: "AFTER" }]
    }
  ],
  assets: [
    { id: "คพ.65-001", asset_name: "เครื่องปรับอากาศ York 18000 BTU", category: "เครื่องใช้ไฟฟ้า", room_id: 201 },
    { id: "คอม-64-012", asset_name: "เครื่องคอมพิวเตอร์ All-in-One Dell", category: "คอมพิวเตอร์", room_id: 301 },
    { id: "โต๊ะ-60-005", asset_name: "โต๊ะเรียนนักศึกษาไม้สัก", category: "ครุภัณฑ์ห้องเรียน", room_id: 101 },
    { id: "พัดลม-63-008", asset_name: "พัดลมติดผนัง Mitsubishi 16 นิ้ว", category: "เครื่องใช้ไฟฟ้า", room_id: 101 }
  ]
};

/**
 * ฟังก์ชันหลักในการเรียก API พร้อม Exponential Backoff Retry Mechanism
 */
async function fetchWithRetry(url, options = {}, retries = 3, backoff = 500) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Timeout 8 วินาที

    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.warn(`[GAS API Retry] Retrying... (${retries} attempts left). Delaying ${backoff}ms`);
      await new Promise(res => setTimeout(res, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export const apiService = {
  // ดึงสถิติ Dashboard
  async getStats() {
    try {
      const res = await fetchWithRetry(`${GAS_WEB_APP_URL}?action=getStats`);
      if (res && res.status === "SUCCESS") return res.data;
    } catch (e) {
      console.info("Using Fallback Mock Stats data due to latency/network offline");
    }
    return MOCK_DATA.stats;
  },

  // ดึงรายการแจ้งซ่อมทั้งหมด
  async getRepairRequests() {
    try {
      const res = await fetchWithRetry(`${GAS_WEB_APP_URL}?action=getRepairRequests`);
      if (res && res.status === "SUCCESS") return res.data;
    } catch (e) {
      console.info("Using Fallback Mock Repair Requests data");
    }
    return MOCK_DATA.requests;
  },

  // สร้างใบแจ้งซ่อมใหม่
  async createRepairRequest(payload) {
    try {
      const res = await fetchWithRetry(GAS_WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "createRepairRequest", ...payload })
      });
      if (res && res.status === "SUCCESS") return res;
    } catch (e) {
      console.warn("GAS API Create Request failed, creating local temporary item:", e);
    }
    // Temporary Fallback Response
    const newId = `REP-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const newItem = {
      id: newId,
      date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      asset_id: payload.asset_id,
      asset_name: payload.asset_name || payload.asset_id,
      building_name: payload.building_name || "อาคารเรียน",
      room_name: payload.room_name || "ห้องเรียน",
      problem_description: payload.problem_description,
      urgency_level: payload.urgency_level,
      status: "PENDING",
      reporter_name: payload.reporter_name || "ผู้ใช้งาน",
      technician_name: "",
      images: payload.image_base64 ? [{ web_view_link: payload.image_base64, image_type: "BEFORE" }] : []
    };
    MOCK_DATA.requests.unshift(newItem);
    MOCK_DATA.stats.total++;
    MOCK_DATA.stats.pending++;
    return { status: "SUCCESS", message: "บันทึกข้อมูลเรียบร้อยแล้ว (Local Fallback)", id: newId };
  },

  // อัปเดตสถานะใบแจ้งซ่อม (สำหรับช่าง)
  async updateRepairStatus(payload) {
    try {
      const res = await fetchWithRetry(GAS_WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "updateRepairStatus", ...payload })
      });
      if (res && res.status === "SUCCESS") return res;
    } catch (e) {
      console.warn("GAS API Update Status failed, updating local state:", e);
    }
    // Update local mock data
    const item = MOCK_DATA.requests.find(r => r.id === payload.id);
    if (item) {
      const oldStatus = item.status;
      item.status = payload.status;
      if (payload.technician_name) item.technician_name = payload.technician_name;
      if (payload.image_base64) {
        item.images.push({ web_view_link: payload.image_base64, image_type: "AFTER" });
      }
      
      // Update stats
      if (oldStatus === "PENDING") MOCK_DATA.stats.pending--;
      if (payload.status === "IN_PROGRESS") MOCK_DATA.stats.inProgress++;
      if (payload.status === "DONE") {
        MOCK_DATA.stats.inProgress--;
        MOCK_DATA.stats.completed++;
      }
    }
    return { status: "SUCCESS", message: "อัปเดตสถานะสำเร็จ (Local Fallback)" };
  },

  // ดึงรายการครุภัณฑ์
  async getAssets() {
    try {
      const res = await fetchWithRetry(`${GAS_WEB_APP_URL}?action=getAssets`);
      if (res && res.status === "SUCCESS") return res.data;
    } catch (e) {
      console.info("Using Fallback Assets data");
    }
    return MOCK_DATA.assets;
  }
};
