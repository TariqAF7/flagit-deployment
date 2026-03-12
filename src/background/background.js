// src/background/background.js
console.log("🚀 FlagIt: Background script loaded");

const REMINDER_TIMER_MS = 3 * 60 * 60 * 1000; // 3 hours

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.set({ scannerStates: {}, offTimestamps: {} });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ scannerStates: {}, offTimestamps: {} });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.type === "CHECK_SCANNER_STATE") {
    chrome.storage.local.get(['scannerStates', 'offTimestamps'], (data) => {
      const platform = request.platform;
      const states = data.scannerStates || {};
      const timestamps = data.offTimestamps || {};

      let state = states[platform] || 'UNINITIALIZED';
      let shouldPrompt = false;

      if (state === 'UNINITIALIZED') {
        shouldPrompt = true;
      } else if (state === 'OFF' && timestamps[platform]) {
        if (Date.now() - timestamps[platform] > REMINDER_TIMER_MS) {
          shouldPrompt = true;
        }
      }

      sendResponse({ state: state, shouldPrompt: shouldPrompt });
    });
    return true; 
  }

  if (request.type === "SET_SCANNER_STATE") {
    chrome.storage.local.get(['scannerStates', 'offTimestamps'], (data) => {
      const platform = request.platform;
      const states = data.scannerStates || {};
      const timestamps = data.offTimestamps || {};

      states[platform] = request.state;
      if (request.state === 'OFF') {
        timestamps[platform] = Date.now(); 
      } else {
        timestamps[platform] = null;
      }

      chrome.storage.local.set({ scannerStates: states, offTimestamps: timestamps }, () => {
        console.log(`🛡️ ${platform} scanner state set to: ${request.state}`);
        sendResponse({ success: true });
      });
    });
    return true;
  }

  if (request.type === "EMAIL_OPENED") {
    chrome.storage.local.get(['scannerStates'], (data) => {
      const states = data.scannerStates || {};
      if (states[request.platform] !== 'ON') {
        console.log(`🔕 Scanner is OFF for ${request.platform}. Ignoring click.`);
        sendResponse({ status: "ignored_scanner_off" });
        return;
      }

      console.log(`💬 Scanning email: "${request.subject}" on ${request.platform}...`);
      
      // --- STEP 2 FIX: GET THE DOMAIN AND CREATE THE KEY ---
      const domain = new URL(sender.tab.url).hostname;
      const STATE_KEY = `scanningState_${domain}`;

      // Save initial scanning state using the dynamic key
      chrome.storage.local.set({ 
        platform: request.platform,
        subject: request.subject,
        emailId: request.emailId,
        currentEmailId: request.emailId,
        [STATE_KEY]: 'scanning', // <-- UPDATED
        timestamp: Date.now()
      }, () => {
        sendResponse({ status: "success" }); 

        // --- SIMULATED AI SCANNER ---
        setTimeout(() => {
          const subjectLower = request.subject.toLowerCase();
          // TEST TRIGGERS
          const isPhishing = subjectLower.includes('urgent') || subjectLower.includes('phish') || subjectLower.includes('shine');

          if (isPhishing) {
            console.log("🚨 THREAT DETECTED! Sending alert to webpage...");
            chrome.storage.local.set({ [STATE_KEY]: 'threat_found' }); // <-- UPDATED
            
            chrome.tabs.sendMessage(sender.tab.id, { 
              type: "SHOW_THREAT_WARNING", 
              subject: request.subject 
            }).catch(err => console.log("Tab communication error:", err));

          } else {
            console.log("✅ Email Safe. Remaining silent in the background.");
            chrome.storage.local.set({ [STATE_KEY]: 'safe' }); // <-- UPDATED
          }
        }, 2000); 
      });
    });
    return true; 
  }

  // --- NEW: OPEN POPUP FROM WARNING BUTTON ---
  if (request.type === "OPEN_EXTENSION_POPUP") {
    chrome.action.openPopup().catch(err => console.log("Could not open popup automatically:", err));
    sendResponse({ success: true });
    return true;
  }

}); 