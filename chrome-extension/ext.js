// FlowRecover Popup & Side Panel Controller
const WEB_APP_URL = "https://flowrecover.web.app";

const I18N = {
  en: {
    sub: "Adaptive Time Blocking & Focus",
    timerTitle: "🎯 Focus Cockpit & Pomodoro",
    timerReady: "READY",
    timerRunning: "FOCUSING",
    timerPaused: "INTERRUPTED ⏸️",
    timerHint: "Select or type a task below to start focusing",
    btnInterrupt: "⏸️ Interrupted!",
    btnResume: "▶️ Resume",
    bmTitle: "🔖 Context Bookmark (Interrupted?)",
    bmPh: "Where were you? What's the immediate next step?",
    bmSave: "Save",
    bmEmpty: "No active interruptions. Deep work in flow!",
    taskTitle: "📅 Today's Task Queue",
    taskPh: "Add a task to today's queue...",
    taskAdd: "+ Add",
    taskEmpty: "No tasks queued. Highlight text on any site & right-click to add!",
    ideaTitle: "💡 Quick Idea Inbox",
    ideaPh: "Capture a random idea without losing focus...",
    ideaAdd: "💡 Save",
    ideaEmpty: "Park distracting thoughts here & stay focused.",
    openWeb: "↗ Open Full Planner (Web App)",
    syncBtn: "↗ Reflow in App"
  },
  th: {
    sub: "จัดตารางเวลาอัตโนมัติ & กู้คืนสมาธิ",
    timerTitle: "🎯 ห้องนักบินโฟกัส & Pomodoro",
    timerReady: "พร้อมโฟกัส",
    timerRunning: "กำลังโฟกัส",
    timerPaused: "มีงานแทรก ⏸️",
    timerHint: "เลือกหรือพิมพ์งานด้านล่างเพื่อเริ่มโฟกัส",
    btnInterrupt: "⏸️ มีงานแทรก!",
    btnResume: "▶️ ทำต่อ",
    bmTitle: "🔖 บันทึกจุดค้าง (เมื่อถูกงานแทรก)",
    bmPh: "ทำถึงไหนแล้ว? ขั้นตอนต่อไปคืออะไร?",
    bmSave: "บันทึก",
    bmEmpty: "ยังไม่มีบันทึกงานแทรก โฟกัสงานต่อได้เลย!",
    taskTitle: "📅 คิวงานวันนี้ (Today's Queue)",
    taskPh: "เพิ่มงานเข้าคิววันนี้...",
    taskAdd: "+ เพิ่ม",
    taskEmpty: "ยังไม่มีงานในคิว (ไฮไลต์ข้อความบนเว็บแล้วคลิกขวาเพื่อส่งมาได้)",
    ideaTitle: "💡 กล่องเก็บไอเดียด่วน (Idea Inbox)",
    ideaPh: "จดไอเดียที่แวบเข้ามาโดยไม่หลุดโฟกัส...",
    ideaAdd: "💡 เก็บ",
    ideaEmpty: "พักความคิดฟุ้งซ่านไว้ที่นี่ แล้วกลับไปโฟกัสงานหลัก",
    openWeb: "↗ เปิดหน้าเว็บแอปเต็ม (Full Planner)",
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
  setTxt("btn-interrupt", t("btnInterrupt"));
  setTxt("btn-resume", t("btnResume"));
  setTxt("lbl-bm-title", t("bmTitle"));
  setTxt("btn-save-bm", t("bmSave"));
  setTxt("lbl-task-title", t("taskTitle"));
  setTxt("btn-add-task", t("taskAdd"));
  setTxt("lbl-idea-title", t("ideaTitle"));
  setTxt("btn-add-idea", t("ideaAdd"));
  setTxt("btn-open-webapp", t("openWeb"));

  const inpBm = document.getElementById("inp-bookmark");
  if (inpBm) inpBm.placeholder = t("bmPh");
  const inpTask = document.getElementById("inp-task");
  if (inpTask) inpTask.placeholder = t("taskPh");
  const inpIdea = document.getElementById("inp-idea");
  if (inpIdea) inpIdea.placeholder = t("ideaPh");
}

async function renderAll() {
  await updateTimerDisplay();
  await renderBookmarks();
  await renderTasks();
  await renderIdeas();
}

async function updateTimerDisplay() {
  const { focusState } = await chrome.storage.local.get({
    focusState: { active: false, paused: false, remainMs: 0, endTime: 0, totalMin: 25, taskTitle: "" }
  });
  const digitsEl = document.getElementById("timer-digits");
  const statusEl = document.getElementById("lbl-timer-status");
  const taskEl = document.getElementById("timer-task");
  const stopBtn = document.getElementById("btn-stop-timer");
  const intBtn = document.getElementById("btn-interrupt");
  const resBtn = document.getElementById("btn-resume");

  if (!focusState || !focusState.active) {
    if (digitsEl) digitsEl.textContent = "25:00";
    if (statusEl) statusEl.textContent = t("timerReady");
    if (taskEl) taskEl.textContent = t("timerHint");
    if (stopBtn) stopBtn.style.display = "none";
    if (intBtn) intBtn.style.display = "inline-flex";
    if (resBtn) resBtn.style.display = "none";
    return;
  }

  const remMs = focusState.paused
    ? Math.max(0, focusState.remainMs || 0)
    : Math.max(0, focusState.endTime - Date.now());
  const totalSec = Math.floor(remMs / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  if (digitsEl) digitsEl.textContent = `${mm}:${ss}`;
  if (statusEl) statusEl.textContent = focusState.paused ? t("timerPaused") : t("timerRunning");
  if (taskEl) taskEl.textContent = focusState.taskTitle || t("timerRunning");
  if (stopBtn) stopBtn.style.display = "inline-flex";
  if (intBtn) intBtn.style.display = focusState.paused ? "none" : "inline-flex";
  if (resBtn) resBtn.style.display = focusState.paused ? "inline-flex" : "none";
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
      <button class="btn ok" data-resume-bm="${escapeHtml(b.id)}">▶️</button>
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
    .slice(0, 10)
    .map(
      (item) => `
    <div class="item ${item.done ? "done" : ""}">
      <input type="checkbox" data-toggle-task="${escapeHtml(item.id)}" ${item.done ? "checked" : ""}>
      <div class="item-title">${escapeHtml(item.title)}</div>
      <button class="btn" data-sync-task="${escapeHtml(item.id)}" title="Send to FlowRecover Web App">${escapeHtml(t("syncBtn"))}</button>
      <button class="btn danger" data-del-task="${escapeHtml(item.id)}">✕</button>
    </div>`
    )
    .join("");
}

async function renderIdeas() {
  const { ideas } = await chrome.storage.local.get({ ideas: [] });
  const listEl = document.getElementById("idea-list");
  const countEl = document.getElementById("idea-count");
  if (countEl) countEl.textContent = String((ideas || []).length);
  if (!listEl) return;
  if (!ideas || ideas.length === 0) {
    listEl.innerHTML = `<div class="empty">${escapeHtml(t("ideaEmpty"))}</div>`;
    return;
  }
  listEl.innerHTML = ideas
    .slice(0, 8)
    .map(
      (idea) => `
    <div class="item">
      <div class="item-title">💡 ${escapeHtml(idea.text)}</div>
      <button class="btn" data-sync-idea="${escapeHtml(idea.id)}">${escapeHtml(t("syncBtn"))}</button>
      <button class="btn danger" data-del-idea="${escapeHtml(idea.id)}">✕</button>
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

  const btnInt = document.getElementById("btn-interrupt");
  if (btnInt) {
    btnInt.addEventListener("click", async () => {
      await chrome.runtime.sendMessage({ type: "PAUSE_INTERRUPT" });
      await updateTimerDisplay();
      const bmCard = document.getElementById("bm-card");
      const inpBm = document.getElementById("inp-bookmark");
      if (bmCard) {
        bmCard.classList.add("highlight");
        setTimeout(() => bmCard.classList.remove("highlight"), 2200);
      }
      if (inpBm) inpBm.focus();
    });
  }

  const btnRes = document.getElementById("btn-resume");
  if (btnRes) {
    btnRes.addEventListener("click", async () => {
      await chrome.runtime.sendMessage({ type: "RESUME_FOCUS" });
      await updateTimerDisplay();
    });
  }

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

  const addIdea = async () => {
    const inp = document.getElementById("inp-idea");
    const text = inp ? inp.value.trim() : "";
    if (!text) return;
    const { ideas } = await chrome.storage.local.get({ ideas: [] });
    ideas.unshift({ id: "id_" + Date.now(), text, createdAt: Date.now() });
    await chrome.storage.local.set({ ideas });
    if (inp) inp.value = "";
    await renderIdeas();
  };

  const btnAddIdea = document.getElementById("btn-add-idea");
  if (btnAddIdea) btnAddIdea.addEventListener("click", addIdea);
  const inpIdea = document.getElementById("inp-idea");
  if (inpIdea) {
    inpIdea.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addIdea();
    });
  }

  document.body.addEventListener("click", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const resBmId = target.getAttribute("data-resume-bm");
    if (resBmId) {
      const { bookmarks } = await chrome.storage.local.get({ bookmarks: [] });
      await chrome.runtime.sendMessage({ type: "RESUME_FOCUS" });
      await chrome.storage.local.set({
        bookmarks: (bookmarks || []).filter((b) => b.id !== resBmId)
      });
      await renderAll();
      return;
    }

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
        const url = `${WEB_APP_URL}/?lang=${currentLang}&ext_task=${encodeURIComponent(found.title)}`;
        await chrome.tabs.create({ url });
      }
      return;
    }

    const delIdeaId = target.getAttribute("data-del-idea");
    if (delIdeaId) {
      const { ideas } = await chrome.storage.local.get({ ideas: [] });
      await chrome.storage.local.set({
        ideas: (ideas || []).filter((item) => item.id !== delIdeaId)
      });
      await renderIdeas();
      return;
    }

    const syncIdeaId = target.getAttribute("data-sync-idea");
    if (syncIdeaId) {
      const { ideas } = await chrome.storage.local.get({ ideas: [] });
      const found = (ideas || []).find((item) => item.id === syncIdeaId);
      if (found) {
        const url = `${WEB_APP_URL}/?lang=${currentLang}&ext_idea=${encodeURIComponent(found.text)}`;
        await chrome.tabs.create({ url });
      }
      return;
    }
  });

  const btnOpenWeb = document.getElementById("btn-open-webapp");
  if (btnOpenWeb) {
    btnOpenWeb.addEventListener("click", async () => {
      await chrome.tabs.create({ url: `${WEB_APP_URL}/?lang=${currentLang}` });
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
