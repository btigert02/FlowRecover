// FlowRecover Chrome Extension — Manifest V3 Service Worker
const ALARM_FOCUS_END = "flowrecover_focus_end";
const ALARM_BADGE_TICK = "flowrecover_badge_tick";

async function setupContextMenus() {
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: "add-to-flowrecover-queue",
    title: "➕ Send '%s' to FlowRecover Today's Queue",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "add-to-flowrecover-idea",
    title: "💡 Send '%s' to FlowRecover Idea Inbox",
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
  const data = await chrome.storage.local.get(["tasks", "bookmarks", "ideas", "focusState"]);
  if (!data.tasks) {
    await chrome.storage.local.set({
      tasks: [
        { id: "t1", title: "Deep Work: Review key deliverables", est: 25, done: false, createdAt: Date.now() }
      ],
      bookmarks: [],
      ideas: [],
      focusState: { active: false, paused: false, remainMs: 0, endTime: 0, totalMin: 25, taskTitle: "" }
    });
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "add-to-flowrecover-queue" && info.selectionText) {
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
      title: "FlowRecover — Added to Today's Queue 📅",
      message: `"${text}"`
    });
  } else if (info.menuItemId === "add-to-flowrecover-idea" && info.selectionText) {
    const text = info.selectionText.trim().slice(0, 160);
    if (!text) return;
    const data = await chrome.storage.local.get({ ideas: [] });
    const ideas = Array.isArray(data.ideas) ? data.ideas : [];
    ideas.unshift({
      id: "id_" + Date.now(),
      text,
      sourceUrl: tab && tab.url ? tab.url : "",
      createdAt: Date.now()
    });
    await chrome.storage.local.set({ ideas });

    chrome.notifications.create("idea_added_" + Date.now(), {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "FlowRecover — Saved to Idea Inbox 💡",
      message: `"${text}"`
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
    focusState: { active: false, paused: false, remainMs: 0, endTime: 0, totalMin: 25, taskTitle: "" }
  });
  if (!focusState || !focusState.active) {
    await chrome.action.setBadgeText({ text: "" });
    await chrome.alarms.clear(ALARM_BADGE_TICK);
    return;
  }
  if (focusState.paused) {
    await chrome.action.setBadgeText({ text: "⏸️" });
    await chrome.action.setBadgeBackgroundColor({ color: "#f59e0b" });
    return;
  }
  const remMs = focusState.endTime - Date.now();
  if (remMs <= 0) {
    await chrome.storage.local.set({
      focusState: { active: false, paused: false, remainMs: 0, endTime: 0, totalMin: focusState.totalMin || 25, taskTitle: "" }
    });
    await chrome.action.setBadgeText({ text: "DONE" });
    await chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
    await chrome.alarms.clear(ALARM_BADGE_TICK);
    chrome.notifications.create("focus_done_" + Date.now(), {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "🎯 Flow Session Complete!",
      message: focusState.taskTitle
        ? `Finished "${focusState.taskTitle}"! Take a 5-min recovery break.`
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
          paused: false,
          remainMs: mins * 60000,
          endTime,
          totalMin: mins,
          taskTitle: msg.taskTitle || ""
        };
        await chrome.storage.local.set({ focusState });
        await chrome.alarms.create(ALARM_FOCUS_END, { when: endTime });
        await chrome.alarms.create(ALARM_BADGE_TICK, { periodInMinutes: 1 });
        await updateFocusBadge();
        sendResponse({ ok: true, focusState });
      } else if (msg.type === "PAUSE_INTERRUPT") {
        const { focusState } = await chrome.storage.local.get({ focusState: null });
        if (focusState && focusState.active && !focusState.paused) {
          const remainMs = Math.max(1000, focusState.endTime - Date.now());
          const nextState = { ...focusState, paused: true, remainMs, endTime: 0 };
          await chrome.storage.local.set({ focusState: nextState });
          await chrome.alarms.clear(ALARM_FOCUS_END);
          await chrome.alarms.clear(ALARM_BADGE_TICK);
          await updateFocusBadge();
          sendResponse({ ok: true, focusState: nextState });
        } else {
          sendResponse({ ok: true });
        }
      } else if (msg.type === "RESUME_FOCUS") {
        const { focusState } = await chrome.storage.local.get({ focusState: null });
        if (focusState && focusState.active && focusState.paused) {
          const rem = Math.max(60000, focusState.remainMs || 25 * 60000);
          const endTime = Date.now() + rem;
          const nextState = { ...focusState, paused: false, endTime, remainMs: rem };
          await chrome.storage.local.set({ focusState: nextState });
          await chrome.alarms.create(ALARM_FOCUS_END, { when: endTime });
          await chrome.alarms.create(ALARM_BADGE_TICK, { periodInMinutes: 1 });
          await updateFocusBadge();
          sendResponse({ ok: true, focusState: nextState });
        } else {
          sendResponse({ ok: true });
        }
      } else if (msg.type === "STOP_FOCUS") {
        await chrome.storage.local.set({
          focusState: { active: false, paused: false, remainMs: 0, endTime: 0, totalMin: 25, taskTitle: "" }
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
