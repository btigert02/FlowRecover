# 🚀 Chrome Web Store Submission & Global Promotion Guide — FlowRecover

ไฟล์นี้รวบรวมข้อมูลทุกช่องสำหรับ **ก๊อปปี้วาง (Copy & Paste)** ลงในหน้า [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) ได้ทันที พร้อมคำชี้แจงสิทธิ์ (Permission Justifications) เพื่อให้ผ่านการตรวจสอบ (Review) อย่างรวดเร็ว

---

## 📦 1. ไฟล์สำหรับอัปโหลดขึ้น Chrome Web Store
- **ไฟล์ ZIP พร้อมอัปโหลด:** `flowrecover-chrome-extension.zip` (อยู่ในโฟลเดอร์หลักของโปรเจกต์)
- หากมีการแก้ไขโค้ดใน `chrome-extension/` สามารถรันคำสั่งสร้างไฟล์ `.zip` ใหม่ได้ตลอดเวลาด้วย:
  ```bash
  bash chrome-extension/build-zip.sh
  ```

---

## 📝 2. Store Listing (ก๊อปปี้วางในแท็บ Store Listing)

### **Title (Name)**
```text
FlowRecover: Focus Timer, Context Bookmark & Task Planner
```

### **Summary (Short Description — ไม่เกิน 132 ตัวอักษร)**
```text
Pause deep work without losing context. Save instant context bookmarks, run Pomodoro focus timers, and capture tasks from any tab.
```

### **Detailed Description (English — สำหรับผู้ใช้ทั่วโลก)**
```text
Stop losing 23 minutes every time you get interrupted! 🧠⚡

FlowRecover is the ultimate Context Recovery & Auto-Reflow Life Planner designed for developers, remote workers, creators, and ADHD minds who juggle deep work with unexpected interruptions.

✨ KEY FEATURES IN THIS EXTENSION:
• 🔖 1-Click Context Bookmark (Interrupted?): Hit pause on your brain when an urgent Slack call or boss request comes in. Jot down exactly where you left off and your immediate next step so you can resume in seconds.
• ⏱️ Deep Focus Pomodoro Timer (25m / 50m): Background-persistent focus timer powered by Chrome Alarms with live badge countdown and desktop completion alerts.
• ⚡ Right-Click Task Capture: Highlight any text on any webpage, right-click, and select "Add to FlowRecover Task Queue" to capture action items without leaving your tab.
• 📌 Always-On Side Panel & Quick Popup: Open FlowRecover as a compact popup or dock it in Chrome's Side Panel right next to your work.
• 🚀 1-Click Sync with FlowRecover Web App (https://flowrecover.web.app): Send queued tasks directly to the full FlowRecover x Life Planner workspace featuring Auto-Reflow Timeline, Eisenhower Matrix, Habit Tracker, and Multi-Currency Finance Tracker ($, €, £, ¥, ฿).
• 🌐 Bilingual Support: Automatically detects English (EN) and Thai (TH).

🔒 PRIVACY FIRST:
All quick tasks, context bookmarks, and focus timer states are stored locally in your browser via chrome.storage.local or synced only when you explicitly send them to your FlowRecover account. No ads, no tracking, no browsing history collection.
```

### **Category & Language**
- **Category:** `Productivity` (Workflow & Planning)
- **Primary Language:** `English`
- **Official URL / Homepage URL:** `https://flowrecover.web.app`
- **Support URL:** `https://flowrecover.web.app`

---

## 🛡️ 3. Privacy Tab & Permission Justifications (ก๊อปปี้วางในแท็บ Privacy Practices)

### **Single Purpose Description**
```text
FlowRecover helps users maintain deep focus, save context bookmarks when interrupted during work, and capture tasks with an integrated Pomodoro focus timer and side panel planner.
```

### **Permission Justifications (เหตุผลการใช้สิทธิ์แต่ละตัว)**

1. **`storage` Justification:**
   ```text
   Required to save the user's task queue, context recovery bookmarks, active Pomodoro focus timer state, and language preference locally in chrome.storage.local across browser sessions.
   ```

2. **`alarms` Justification:**
   ```text
   Required to run the Pomodoro focus countdown timer reliably in the Manifest V3 background service worker and update the toolbar badge every minute even when the popup is closed.
   ```

3. **`notifications` Justification:**
   ```text
   Required to alert the user with a desktop notification when a 25-minute or 50-minute focus session finishes, and to confirm when selected text is added to the FlowRecover task queue via the context menu.
   ```

4. **`contextMenus` Justification:**
   ```text
   Required to provide a right-click menu option ("Add to FlowRecover Task Queue") so users can highlight text on any webpage and save it as a task, as well as open the FlowRecover Side Panel.
   ```

5. **`sidePanel` Justification:**
   ```text
   Required to let users open the FlowRecover focus timer, context bookmarks, and task queue inside Chrome's persistent Side Panel alongside their active webpage.
   ```

### **Remote Code**
- เลือก: **No, I am not using Remote Code** (โค้ดทั้งหมดอยู่ในแพ็กเกจ Extension เรียบร้อยแล้ว)

### **Data Usage Disclosures**
- เช็คถูกเฉพาะข้อมูลพื้นฐาน (หากใช้เฉพาะ Extension จะเก็บในเครื่อง 100%)
- เช็คถูกช่องรับรอง 3 ข้อล่างสุด (I certify that...ไม่ขายข้อมูลให้บุคคลที่สาม)
- **Privacy Policy URL:**
  ```text
  https://flowrecover.web.app/privacy.html
  ```

---

## 🌍 4. แผนการโปรโมทให้คนต่างชาติใช้งานและซื้อ PRO ($2.99 / $7.99 / $29 USD)

1. **Product Hunt Launch:**
   - ตั้งชื่อแคมเปญ: *"FlowRecover — The Context-Recovery Planner for Interrupted Minds"*
   - ชูจุดเด่นเรื่อง **"Interrupted? Save a Context Bookmark in 3 seconds & Auto-Reflow your day"** ซึ่งแตกต่างจาก Todoist/Notion ทั่วไป
2. **Reddit Communities (Organic Traffic คุณภาพสูง):**
   - โพสต์แชร์ปัญหาและวิธีแก้ใน `r/productivity`, `r/ADHD_Programmers`, `r/SideProject`, `r/chrome_extensions`
   - แจกโค้ดหรือเปิดให้ทดลองใช้ฟรี 7 วัน (ระบบใน `https://flowrecover.web.app` รองรับภาษาอังกฤษอัตโนมัติ + แสดงราคา `$ USD` คู่กับ `฿ THB` เรียบร้อยแล้ว)
3. **Chrome Web Store Organic SEO:**
   - ชื่อและคำอธิบายมีคีย์เวิร์ดหลักครบ: *Focus Timer, Context Bookmark, Task Planner, Pomodoro, ADHD Planner* ช่วยให้ติดผลการค้นหาในสโตร์ทั่วโลก

