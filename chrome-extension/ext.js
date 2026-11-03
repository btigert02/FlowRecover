// FlowRecover Popup & Side Panel Controller
const WEB_APP_URL = "https://flowrecover.web.app";

const I18N = {
  en: {
    sub: "Focus & Context Recovery",
    timerTitle: "⏱️ Deep Focus Timer",
    timerReady: "READY",
    timerRunning: "FOCUSING",
    timerHint: "Select or type a task to start focusing",
    bmTitle: "🔖 Context Bookmark (Interrupted?)",
    bmPh: "Where were you? What's the next step?",
    bmSave: "Save",
    bmEmpty: "No active interruptions. You're in control!",
    taskTitle: "📋 Quick Task Queue",
    taskPh: "Add a quick task...",
    taskAdd: "+ Add",
    taskEmpty: "No tasks queued. Right-click any text on a webpage to add!",
    openWeb: "🚀 Open Full FlowRecover App",
    syncBtn: "↗ Send to Web"
  },
  th: {
    sub: "กู้คืนสมาธิ & จัดตารางงานอัตโนมัติ",
    timerTitle: "⏱️ จับเวลาโฟกัส (Pomodoro)",
    timerReady: "พร้อมโฟกัส",
    timerRunning: "กำลังโฟกัส",
    timerHint: "เลือกหรือพิมพ์งานด้านล่างเพื่อเริ่มจับเวลา",
    bmTitle: "🔖 ทดความจำด่วน (เมื่อถูกงานแทรก)",
    bmPh: "ทำถึงไหนแล้ว? ขั้นตอนต่อไปคืออะไร?",
    bmSave: "บันทึก",
    bmEmpty: "ยังไม่มีบันทึกงานแทรก โฟกัสต่อได้เลย!",
    taskTitle: "📋 คิวงานด่วน (Task Queue)",
    taskPh: "พิมพ์งานที่ต้องทำ...",
    taskAdd: "+ เพิ่ม",
    taskEmpty: "ยังไม่มีงานในคิว (คลิกขวาข้อความบนเว็บเพื่อส่งมาที่นี่ได้)",
    openWeb: "🚀 เปิดแอปเต็ม FlowRecover",
    syncBtn: "↗ ส่งเข้าแอป"
  }
};

let currentLang = (navigator.language || "en").toLowerCase().startsWith("th") ? "th" : "en";
let tickTimer = null;

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

async function init() {
  const stored = await chrome.storage.local.get(["lang"]);
  if (stored.lang === "th" || stored.lang === "en") {
    currentLang = stored.lang;
  }
  applyLang();
  await renderAll();
  bindEvents();
  tickTimer = setInterval(updateTimerDisplay, 1000);
}

function applyLang() {
  const btnLang = document.getElementById("btn-lang");
  if (btnLang) btnLang.textContent = currentLang === "en" ? "🌐 EN" : "🌐 TH";
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setTxt("lbl-sub", t("sub"));
  setTxt("lbl-timer-title", t("timerTitle"));
  setTxt("lbl-bm-title", t("bmTitle"));
  setTxt("btn-save-bm", t("bmSave"));
  setTxt("lbl-task-title", t("taskTitle"));
  setTxt("btn-add-task", t("taskAdd"));
  setTxt("btn-open-webapp", t("openWeb"));

  const inpBm = document.getElementById("inp-bookmark");
  if (inpBm) inpBm.placeholder = t("bmPh");
  const inpTask = document.getElementById("inp-task");
  if (inpTask) inpTask.placeholder = t("taskPh");
}

async function renderAll() {
  await updateTimerDisplay();
  await renderBookmarks();
  await renderTasks();
}

async function updateTimerDisplay() {
  const { focusState } = await chrome.storage.local.get({
    focusState: { active: false, endTime: 0, totalMin: 25, taskTitle: "" }
  });
  const digitsEl = document.getElementById("timer-digits");
  const statusEl = document.getElementById("lbl-timer-status");
  const taskEl = document.getElementById("timer-task");
  const stopBtn = document.getElementById("btn-stop-timer");

  if (!focusState || !focusState.active || !focusState.endTime) {
    if (digitsEl) digitsEl.textContent = "25:00";
    if (statusEl) statusEl.textContent = t("timerReady");
    if (taskEl) taskEl.textContent = t("timerHint");
    if (stopBtn) stopBtn.style.display = "none";
    return;
  }

  const remMs = Math.max(0, focusState.endTime - Date.now());
  const totalSec = Math.floor(remMs / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  if (digitsEl) digitsEl.textContent = `${mm}:${ss}`;
  if (statusEl) statusEl.textContent = t("timerRunning");
  if (taskEl) taskEl.textContent = focusState.taskTitle || t("timerRunning");
  if (stopBtn) stopBtn.style.display = "inline-flex";
}

async function renderBookmarks() {
  const { bookmarks } = await chrome.storage.local.get({ bookmarks: [] });
  const listEl = document.getElementById("bm-list");
  if (!listEl) return;
  if (!bookmarks || bookmarks.length === 0) {
    listEl.innerHTML = `<div class="empty">${escapeHtml(t("bmEmpty"))}</div>`;
    return;
  }
  listEl.innerHTML = bookmarks
    .slice(0, 5)
    .map(
      (b) => `
    <div class="item">
      <div class="item-title">🔖 ${escapeHtml(b.note)}</div>
      <button class="btn danger" data-del-bm="${escapeHtml(b.id)}">✕</button>
    </div>`
    )
    .join("");
}

async function renderTasks() {
  const { tasks } = await chrome.storage.local.get({ tasks: [] });
  const listEl = document.getElementById("task-list");
  const countEl = document.getElementById("task-count");
  if (countEl) countEl.textContent = String((tasks || []).filter((x) => !x.done).length);
  if (!listEl) return;
  if (!tasks || tasks.length === 0) {
    listEl.innerHTML = `<div class="empty">${escapeHtml(t("taskEmpty"))}</div>`;
    return;
  }
  listEl.innerHTML = tasks
    .slice(0, 12)
    .map(
      (item) => `
    <div class="item ${item.done ? "done" : ""}">
      <input type="checkbox" data-toggle-task="${escapeHtml(item.id)}" ${item.done ? "checked" : ""}>
      <div class="item-title">${escapeHtml(item.title)}</div>
      <button class="btn" data-sync-task="${escapeHtml(item.id)}" title="Open in Web App">${escapeHtml(t("syncBtn"))}</button>
      <button class="btn danger" data-del-task="${escapeHtml(item.id)}">✕</button>
    </div>`
    )
    .join("");
}

function bindEvents() {
  const btnLang = document.getElementById("btn-lang");
  if (btnLang) {
    btnLang.addEventListener("click", async () => {
      currentLang = currentLang === "en" ? "th" : "en";
      await chrome.storage.local.set({ lang: currentLang });
      applyLang();
      await renderAll();
    });
  }

  const btnSide = document.getElementById("btn-sidepanel");
  if (btnSide) {
    btnSide.addEventListener("click", async () => {
      try {
        const win = await chrome.windows.getCurrent();
        await chrome.sidePanel.open({ windowId: win.id });
        window.close();
      } catch (e) {
        console.error("Side panel open error:", e);
      }
    });
  }

  const startFocus = async (minutes) => {
    const { tasks } = await chrome.storage.local.get({ tasks: [] });
    const firstOpen = (tasks || []).find((x) => !x.done);
    const taskTitle = firstOpen ? firstOpen.title : "Deep Focus Session";
    await chrome.runtime.sendMessage({ type: "START_FOCUS", minutes, taskTitle });
    await updateTimerDisplay();
  };

  const btn25 = document.getElementById("btn-start-25");
  if (btn25) btn25.addEventListener("click", () => startFocus(25));
  const btn50 = document.getElementById("btn-start-50");
  if (btn50) btn50.addEventListener("click", () => startFocus(50));
  const btnStop = document.getElementById("btn-stop-timer");
  if (btnStop) {
    btnStop.addEventListener("click", async () => {
      await chrome.runtime.sendMessage({ type: "STOP_FOCUS" });
      await updateTimerDisplay();
    });
  }

  const saveBm = async () => {
    const inp = document.getElementById("inp-bookmark");
    const note = inp ? inp.value.trim() : "";
    if (!note) return;
    const { bookmarks } = await chrome.storage.local.get({ bookmarks: [] });
    bookmarks.unshift({ id: "bm_" + Date.now(), note, createdAt: Date.now() });
    await chrome.storage.local.set({ bookmarks });
    if (inp) inp.value = "";
    await renderBookmarks();
  };

  const btnSaveBm = document.getElementById("btn-save-bm");
  if (btnSaveBm) btnSaveBm.addEventListener("click", saveBm);
  const inpBm = document.getElementById("inp-bookmark");
  if (inpBm) {
    inpBm.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveBm();
    });
  }

  const addTask = async () => {
    const inp = document.getElementById("inp-task");
    const title = inp ? inp.value.trim() : "";
    if (!title) return;
    const { tasks } = await chrome.storage.local.get({ tasks: [] });
    tasks.unshift({ id: "t_" + Date.now(), title, est: 25, done: false, createdAt: Date.now() });
    await chrome.storage.local.set({ tasks });
    if (inp) inp.value = "";
    await renderTasks();
  };

  const btnAddTask = document.getElementById("btn-add-task");
  if (btnAddTask) btnAddTask.addEventListener("click", addTask);
  const inpTask = document.getElementById("inp-task");
  if (inpTask) {
    inpTask.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addTask();
    });
  }

  document.body.addEventListener("click", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const delBmId = target.getAttribute("data-del-bm");
    if (delBmId) {
      const { bookmarks } = await chrome.storage.local.get({ bookmarks: [] });
      await chrome.storage.local.set({
        bookmarks: (bookmarks || []).filter((b) => b.id !== delBmId)
      });
      await renderBookmarks();
      return;
    }

    const toggleTaskId = target.getAttribute("data-toggle-task");
    if (toggleTaskId) {
      const { tasks } = await chrome.storage.local.get({ tasks: [] });
      const updated = (tasks || []).map((item) =>
        item.id === toggleTaskId ? { ...item, done: !item.done } : item
      );
      await chrome.storage.local.set({ tasks: updated });
      await renderTasks();
      return;
    }

    const delTaskId = target.getAttribute("data-del-task");
    if (delTaskId) {
      const { tasks } = await chrome.storage.local.get({ tasks: [] });
      await chrome.storage.local.set({
        tasks: (tasks || []).filter((item) => item.id !== delTaskId)
      });
      await renderTasks();
      return;
    }

    const syncTaskId = target.getAttribute("data-sync-task");
    if (syncTaskId) {
      const { tasks } = await chrome.storage.local.get({ tasks: [] });
      const found = (tasks || []).find((item) => item.id === syncTaskId);
      if (found) {
        const url = `${WEB_APP_URL}/?ext_task=${encodeURIComponent(found.title)}`;
        await chrome.tabs.create({ url });
      }
      return;
    }
  });

  const btnOpenWeb = document.getElementById("btn-open-webapp");
  if (btnOpenWeb) {
    btnOpenWeb.addEventListener("click", async () => {
      await chrome.tabs.create({ url: WEB_APP_URL });
    });
  }
}

document.addEventListener("DOMContentLoaded", init);

