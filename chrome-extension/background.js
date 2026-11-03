// FlowRecover Chrome Extension — Manifest V3 Service Worker
const ALARM_FOCUS_END = "flowrecover_focus_end";
const ALARM_BADGE_TICK = "flowrecover_badge_tick";

async function setupContextMenus() {
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: "add-to-flowrecover",
    title: "⚡ Add '%s' to FlowRecover Task Queue",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "open-sidepanel",
    title: "📌 Open FlowRecover Side Panel",
    contexts: ["all"]
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  await setupContextMenus();
  const data = await chrome.storage.local.get(["tasks", "bookmarks", "expenses", "focusState"]);
  if (!data.tasks) {
    await chrome.storage.local.set({
      tasks: [
        { id: "t1", title: "Deep Work: Review key deliverables", est: 25, done: false, createdAt: Date.now() }
      ],
      bookmarks: [],
      expenses: [],
      focusState: { active: false, endTime: 0, totalMin: 25, taskTitle: "" }
    });
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "add-to-flowrecover" && info.selectionText) {
    const text = info.selectionText.trim().slice(0, 140);
    if (!text) return;
    const data = await chrome.storage.local.get({ tasks: [] });
    const tasks = Array.isArray(data.tasks) ? data.tasks : [];
    tasks.unshift({
      id: "t_" + Date.now(),
      title: text,
      est: 25,
      done: false,
      sourceUrl: tab && tab.url ? tab.url : "",
      createdAt: Date.now()
    });
    await chrome.storage.local.set({ tasks });

    await chrome.action.setBadgeText({ text: String(tasks.filter(t => !t.done).length) });
    await chrome.action.setBadgeBackgroundColor({ color: "#f59e0b" });

    chrome.notifications.create("task_added_" + Date.now(), {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "FlowRecover — Task Captured ⚡",
      message: `Added to queue: "${text}"`
    });
  } else if (info.menuItemId === "open-sidepanel" && tab && tab.windowId) {
    try {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (err) {
      console.error("Failed to open side panel:", err);
    }
  }
});

async function updateFocusBadge() {
  const { focusState } = await chrome.storage.local.get({
    focusState: { active: false, endTime: 0, totalMin: 25, taskTitle: "" }
  });
  if (!focusState || !focusState.active || !focusState.endTime) {
    await chrome.action.setBadgeText({ text: "" });
    await chrome.alarms.clear(ALARM_BADGE_TICK);
    return;
  }
  const remMs = focusState.endTime - Date.now();
  if (remMs <= 0) {
    await chrome.storage.local.set({
      focusState: { active: false, endTime: 0, totalMin: focusState.totalMin || 25, taskTitle: "" }
    });
    await chrome.action.setBadgeText({ text: "DONE" });
    await chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
    await chrome.alarms.clear(ALARM_BADGE_TICK);
    chrome.notifications.create("focus_done_" + Date.now(), {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "🎯 Flow Session Complete!",
      message: focusState.taskTitle
        ? `Great job finishing "${focusState.taskTitle}"! Take a 5-min recovery break.`
        : "Your focus session is complete. Time for a quick recovery break!"
    });
    return;
  }
  const remMin = Math.max(1, Math.ceil(remMs / 60000));
  await chrome.action.setBadgeText({ text: `${remMin}m` });
  await chrome.action.setBadgeBackgroundColor({ color: "#f59e0b" });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_FOCUS_END || alarm.name === ALARM_BADGE_TICK) {
    await updateFocusBadge();
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg.type === "START_FOCUS") {
        const mins = Number(msg.minutes) || 25;
        const endTime = Date.now() + mins * 60000;
        const focusState = {
          active: true,
          endTime,
          totalMin: mins,
          taskTitle: msg.taskTitle || ""
        };
        await chrome.storage.local.set({ focusState });
        await chrome.alarms.create(ALARM_FOCUS_END, { when: endTime });
        await chrome.alarms.create(ALARM_BADGE_TICK, { periodInMinutes: 1 });
        await updateFocusBadge();
        sendResponse({ ok: true, focusState });
      } else if (msg.type === "STOP_FOCUS") {
        await chrome.storage.local.set({
          focusState: { active: false, endTime: 0, totalMin: 25, taskTitle: "" }
        });
        await chrome.alarms.clear(ALARM_FOCUS_END);
        await chrome.alarms.clear(ALARM_BADGE_TICK);
        await chrome.action.setBadgeText({ text: "" });
        sendResponse({ ok: true });
      }
    } catch (e) {
      console.error("Background message error:", e);
      sendResponse({ ok: false, error: e.message });
    }
  })();
  return true;
});

