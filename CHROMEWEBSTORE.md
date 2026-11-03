# 🚀 คู่มือนำขึ้น Chrome Web Store Developer Console (Step-by-Step) — FlowRecover

เนื่องจากคุณสมัครบัญชีนักพัฒนาและชำระค่าธรรมเนียมแรกเข้า $5 USD เรียบร้อยแล้ว คุณสามารถทำตามขั้นตอนด้านล่างเพื่อ **อัปโหลดไฟล์ + วางข้อความ ASO + อัปโหลดรูปภาพ + ส่งตรวจสอบ (Submit for Review)** ให้เสร็จภายใน **5 นาที** ได้เลยครับ!

---

## 📦 ขั้นตอนที่ 1: อัปโหลดไฟล์ ZIP เข้าสู่ระบบ
1. เปิดหน้า [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
2. คลิกปุ่มสีน้ำเงิน **`+ New item`** (มุมขวาบน)
3. เลือกไฟล์ **[`flowrecover-chrome-extension.zip`](file:///Users/thanaetchaisuwan/Desktop/Project%20AI/FlowRecover/flowrecover-chrome-extension.zip)** (อยู่ในโฟลเดอร์หลัก `/Users/thanaetchaisuwan/Desktop/Project AI/FlowRecover/flowrecover-chrome-extension.zip`)

---

## 📝 ขั้นตอนที่ 2: แท็บ Store Listing (ก๊อปปี้วางตามช่องด้านล่าง)

### 1. **Title & Summary** *(ดึงจาก `manifest.json` ให้อัตโนมัติแล้ว)*
- **Title (Name):**
  ```text
  FlowRecover: Adaptive Time Blocking, Pomodoro & Life Planner
  ```
- **Summary (Short Description — 126 ตัวอักษร):**
  ```text
  The time-blocking planner built for people who get interrupted. Save 1-click context bookmarks, run Pomodoro timers & auto-reflow tasks.
  ```

### 2. **Description (คำอธิบายแบบจัดเต็ม ASO ดึงดูดลูกค้าต่างชาติ — ก๊อปปี้วางในช่อง Description)**
```text
The Time-Blocking Planner Built for People Who Get Interrupted! 🧠⚡

Traditional time-blocking schedules break by 10:00 AM the moment an urgent Slack message, client call, or boss request comes in. FlowRecover fixes that.

Designed for developers, freelancers, remote workers, project managers, and ADHD / neurodivergent minds, FlowRecover lets you hit pause on your brain with a 1-click Context Bookmark ("⏸️ Interrupted!") and automatically reflows your remaining daily schedule.

✨ KEY FEATURES IN THIS CHROME EXTENSION:
• 📌 Always-On Chrome Side Panel & Quick Popup: Keep your Focus Cockpit, Pomodoro countdown, and Today's Task Queue docked right next to any webpage without switching tabs.
• ⏸️ 1-Click "Interrupted!" Button & Context Bookmark: Got interrupted mid-task? Click "⏸️ Interrupted!", jot down where you left off + your immediate next step, and resume in seconds without losing 23 minutes of context switching.
• ⏱️ Background Pomodoro Timer (25m / 50m): Powered by Manifest V3 Chrome Alarms with live toolbar badge countdown and desktop completion notifications even when the popup is closed.
• ➕ Right-Click Webpage Capture: Highlight any text in Gmail, Slack, Notion, or any website, right-click, and choose:
  - "➕ Send to FlowRecover Today's Queue"
  - "💡 Send to FlowRecover Idea Inbox"
• 💡 Quick Idea Inbox: Park random distracting thoughts in 2 seconds so you stay locked in deep work.
• ↗ 1-Click Sync with Full FlowRecover Web App (https://flowrecover.web.app):
  - Auto-Reflow Daily Time-Blocking Queue
  - 2-Way Google Calendar Sync & Google Drive Attachments
  - Projects with Interactive Gantt Timeline, Flowchart & Mind Map
  - Recurring Routines, Habit Streaks, Daytime Breaks & Sleep Cycle Planner
  - All-in-One Life Planner: Vision Board, Multi-Currency Finance Tracker ($, €, £, ¥, ฿), Workout & Meal Logs
  - Real-time Smartwatch Buzz Alerts via ntfy

🎁 FREE TRIAL & AFFORDABLE GLOBAL PRICING:
• Includes a 7-Day Full-Featured Free Trial (no credit card required).
• Affordable PRO Pass compared to $20–$34/mo alternatives:
  - Monthly (30 Days): $2.99 USD (99฿)
  - Quarterly (90 Days): $7.99 USD (269฿ — Most Popular)
  - Yearly (365 Days): $29.00 USD (990฿ — Best Value)

🔒 PRIVACY-FIRST & LIGHTWEIGHT:
No ads, no tracking, no browsing history collection, and zero host permissions required.
```

### 3. **Category & Language**
- **Category:** เลือก `Productivity` (หรือ `Workflow & Planning`)
- **Language:** เลือก `English`

### 4. **Graphic Assets (รูปภาพพร้อมอัปโหลด อยู่ในโฟลเดอร์ [`store-assets/`](file:///Users/thanaetchaisuwan/Desktop/Project%20AI/FlowRecover/store-assets))**
เราสร้างรูปภาพทุกขนาดตามมาตรฐานของ Google (`24-bit PNG` ไม่มีพื้นหลังโปร่งใส `hasAlpha: no`) เตรียมไว้ให้ครบแล้วครับ:
1. **Store Icon (`128x128`):** เลือกไฟล์ [`store-assets/store-icon-128x128.png`](file:///Users/thanaetchaisuwan/Desktop/Project%20AI/FlowRecover/store-assets/store-icon-128x128.png)
2. **Screenshots (`1280x800` — อัปโหลดทั้ง 2 รูปได้เลย):**
   - รูปที่ 1: [`store-assets/screenshot-1-focus-reflow-1280x800.png`](file:///Users/thanaetchaisuwan/Desktop/Project%20AI/FlowRecover/store-assets/screenshot-1-focus-reflow-1280x800.png)
   - รูปที่ 2: [`store-assets/screenshot-2-life-planner-1280x800.png`](file:///Users/thanaetchaisuwan/Desktop/Project%20AI/FlowRecover/store-assets/screenshot-2-life-planner-1280x800.png)
3. **Small Promo Tile (`440x280`):** เลือกไฟล์ [`store-assets/small-promo-tile-440x280.png`](file:///Users/thanaetchaisuwan/Desktop/Project%20AI/FlowRecover/store-assets/small-promo-tile-440x280.png)
4. **Marquee Promo Tile (`1400x560`):** เลือกไฟล์ [`store-assets/marquee-promo-tile-1400x560.png`](file:///Users/thanaetchaisuwan/Desktop/Project%20AI/FlowRecover/store-assets/marquee-promo-tile-1400x560.png)

### 5. **Additional Fields (URLs)**
- **Official URL / Homepage URL:** `https://flowrecover.web.app`
- **Support URL:** `https://flowrecover.web.app`

---

## 🛡️ ขั้นตอนที่ 3: แท็บ Privacy Practices (ก๊อปปี้วางเพื่อให้ผ่าน Review ในครั้งเดียว)

### 1. **Single Purpose Description**
```text
FlowRecover helps users maintain deep focus, save context bookmarks when interrupted during work, and manage their daily time-blocking task queue and Pomodoro timer via Chrome's popup and side panel.
```

### 2. **Permission Justifications (คำชี้แจงสิทธิ์ทั้ง 5 ตัว)**

- **`storage` Justification:**
  ```text
  Required to store the user's daily task queue, context recovery bookmarks, quick ideas, active Pomodoro focus timer state, and language preference locally on the device using chrome.storage.local.
  ```
- **`alarms` Justification:**
  ```text
  Required to run the Pomodoro focus countdown timer reliably in the Manifest V3 background service worker and update the extension toolbar badge every minute while a focus session is active.
  ```
- **`notifications` Justification:**
  ```text
  Required to notify the user with a desktop notification when a 25-minute or 50-minute focus session completes, and to confirm when highlighted text is added to the task queue or idea inbox via the context menu.
  ```
- **`contextMenus` Justification:**
  ```text
  Required to provide right-click menu options ("Send to FlowRecover Today's Queue", "Send to FlowRecover Idea Inbox", and "Open FlowRecover Side Panel") when the user highlights text on a webpage.
  ```
- **`sidePanel` Justification:**
  ```text
  Required to let users open the FlowRecover Focus Cockpit, Pomodoro timer, context bookmarks, and task queue inside Chrome's Side Panel alongside their active tab.
  ```

### 3. **Remote Code**
- เลือก: **`No, I am not using Remote Code`**

### 4. **Data Usage & Privacy Policy URL**
- ติ๊กถูกช่องรับรอง 3 ข้อล่างสุด (*I certify that...*)
- ช่อง **Privacy Policy URL** (ในแท็บ Privacy หรือ Account):
  ```text
  https://flowrecover.web.app/privacy.html
  ```
  *(อัปเดตหน้า `privacy.html` ให้มีหมวดภาษาอังกฤษสำหรับผู้ตรวจ Chrome Web Store เรียบร้อยแล้ว)*

---

## 🚀 ขั้นตอนที่ 4: กด Save Draft และ Submit for Review!
- คลิก **`Save draft`** มุมขวาบน จากนั้นคลิก **`Submit for review`**
- ปกติ Google จะใช้เวลาตรวจอนุมัติเพียง **24–72 ชั่วโมง** เท่านั้นเนื่องจากเราไม่ได้ขอสิทธิ์เข้าถึงหน้าเว็บ (`<all_urls>`) เลยครับ!
