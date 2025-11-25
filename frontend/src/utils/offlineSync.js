const QUEUE_KEY = "gramsathi_sync_queue";
const API_BASE_URL = "http://localhost:8080"; // Change this for production

// --- 1. OFFLINE DATA QUEUE ---

/**
 * Saves an API request to localStorage to be retried later.
 * @param {string} url - The API endpoint (e.g., '/api/progress')
 * @param {string} method - HTTP Method (POST, PUT, etc.)
 * @param {object} body - The JSON payload
 */
export const saveOfflineAction = (url, method, body) => {
  try {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");

    const action = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      url,
      method,
      body,
      timestamp: new Date().toISOString(),
    };

    queue.push(action);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log("📦 [OfflineSync] Action queued:", action);
  } catch (e) {
    console.error("Failed to save offline action:", e);
  }
};

/**
 * Iterates through the offline queue and attempts to send requests to the server.
 * Should be called when the 'online' event fires.
 */
export const syncOfflineActions = async () => {
  if (!navigator.onLine) return;

  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  if (queue.length === 0) return;

  console.log(`🔄 [OfflineSync] Syncing ${queue.length} actions...`);

  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Cannot sync offline data: No token found.");
    return;
  }

  const failedActions = [];
  let successCount = 0;

  for (const action of queue) {
    try {
      const res = await fetch(`${API_BASE_URL}${action.url}`, {
        method: action.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(action.body),
      });

      if (!res.ok) {
        // If server error (500), keep to retry. If client error (400), discard.
        if (res.status >= 500) {
          console.error(`Sync failed for ${action.id}, server error. Keeping.`);
          failedActions.push(action);
        } else {
          console.error(
            `Sync rejected for ${action.id}, status ${res.status}. Discarding.`
          );
        }
      } else {
        console.log("✅ [OfflineSync] Action synced:", action.id);
        successCount++;
      }
    } catch (err) {
      console.error("Network error during sync:", err);
      failedActions.push(action); // Keep if network fails
    }
  }

  // Update queue with only failed items
  localStorage.setItem(QUEUE_KEY, JSON.stringify(failedActions));

  if (successCount > 0) {
    const event = new CustomEvent("gramsathi-sync-complete", {
      detail: { count: successCount },
    });
    window.dispatchEvent(event);
    alert(
      `☁️ ${successCount} offline activities have been synced to your profile!`
    );
  }
};

// --- 2. AUDIO ACCESSIBILITY (Modified to prioritize female voice) ---

/**
 * Text-to-Speech helper.
 * @param {string} text - Text to speak
 * @param {string} lang - Language code (e.g., 'hi-IN', 'en-US', 'bn-IN')
 */
export const speak = (text, lang = "hi-IN") => {
  if (!window.speechSynthesis) {
    console.warn("Web Speech API not supported");
    return;
  }

  window.speechSynthesis.cancel(); // Stop previous audio

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  // Use only the primary language code (e.g., 'hi' from 'hi-IN') for matching
  const langCode = lang.split("-")[0];

  // 1. Prioritize a female voice matching the language code (for consistent Hindi voice)
  let targetVoice = voices.find(
    (v) =>
      v.lang.includes(langCode) &&
      (v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("zira"))
  );

  // 2. Fallback: Find any voice that supports the language code
  if (!targetVoice) {
    targetVoice = voices.find((v) => v.lang.includes(langCode));
  }

  // 3. Apply the found voice
  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  window.speechSynthesis.speak(utterance);
};
