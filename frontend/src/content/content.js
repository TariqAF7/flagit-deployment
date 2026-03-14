// src/content/content.js
console.log("🚀 FlagIt content script loaded on:", window.location.hostname);
const currentDomain = window.location.hostname;
const STATE_KEY = `scanningState_${currentDomain}`;

// --- UTILITY FUNCTIONS ---
function safeSendMessage(message) {
  try {
    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage(message, () => {
        if (chrome.runtime?.lastError) {
          console.log("FlagIt Note:", chrome.runtime.lastError.message);
        }
      });
    } else {
      console.log("🔄 FlagIt: Old script safely deactivated. Refresh tab (F5) to reconnect.");
    }
  } catch (error) {
    console.log("🔄 FlagIt Note: Could not contact extension.", error);
  }
}

function generateEmailId(emailRow) {
  const threadId = emailRow.getAttribute('jslog');
  if (threadId) return `gmail_${threadId}`;
  
  const subjectElement = emailRow.querySelector('.y6');
  const subject = subjectElement ? subjectElement.textContent.slice(0, 20) : 'unknown';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `email_${timestamp}_${random}_${subject.replace(/[^a-zA-Z0-9]/g, '')}`;
}

function generateGenericId(prefix, textContext) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const safeText = (textContext || 'unknown').slice(0, 20).replace(/[^a-zA-Z0-9]/g, '');
  return `${prefix}_${timestamp}_${random}_${safeText}`;
}

function detectInboxView() {
  const intervalId = setInterval(() => {
    try {
      if (!chrome.runtime?.id) {
        clearInterval(intervalId);
        return;
      }
      
      // Look for Gmail OR Outlook email bodies being open
      const isEmailOpen = document.querySelector('.hP') || document.querySelector('[aria-label="Message body"]'); 
      
      if (!isEmailOpen) {
        chrome.storage.local.get([STATE_KEY], (data) => {
          // If THIS SPECIFIC PLATFORM has a stuck state, wipe it!
          if (data[STATE_KEY]) {
            chrome.storage.local.remove([STATE_KEY, 'currentEmailId']);
          }
        });
      }
    } catch (e) {
      clearInterval(intervalId);
    }
  }, 1000);
}

// --- PLATFORM DETECTORS ---
function detectGmailEmailOpen() {
  document.addEventListener('click', (event) => {
    const emailRow = event.target.closest('.zA');
    if (!emailRow) return;
    
    if (
      event.target.closest('[role="checkbox"]') ||
      event.target.closest('[data-tooltip="Archive"]') ||
      event.target.closest('[data-tooltip="Mark as unread"]') ||
      event.target.closest('[data-tooltip="Mark as read"]') ||
      event.target.closest('[data-tooltip="Delete"]') ||
      event.target.closest('[data-tooltip="Snooze"]') ||
      event.target.closest('[data-tooltip="Starred"]') ||
      event.target.closest('[data-tooltip="Not starred"]')
    ) return;
    
    console.log("📧 Gmail Email opened");
    const subjectElement = emailRow.querySelector('.y6');
    const subject = subjectElement ? subjectElement.textContent : 'Unknown';
    
    safeSendMessage({ 
      type: "EMAIL_OPENED",
      platform: "gmail",
      subject: subject,
      emailId: generateEmailId(emailRow)
    });
  }, true);
}

function detectOutlookEmailOpen() {
  document.addEventListener('click', (event) => {
    if (
      event.target.closest('nav') || 
      event.target.closest('[role="tree"]') || 
      event.target.closest('[role="banner"]') ||
      event.target.closest('[role="tablist"]')
    ) {
      return;
    }

    const emailRow = event.target.closest('[role="row"]') || 
                     event.target.closest('[role="option"]');
                     
    if (!emailRow) return;

    if (!emailRow.hasAttribute('aria-selected') && !emailRow.hasAttribute('aria-label')) {
      return;
    }

    if (
      event.target.closest('[role="checkbox"]') || 
      event.target.closest('button') || 
      event.target.closest('[data-icon-name="Delete"]') ||
      event.target.closest('[data-icon-name="Flag"]')
    ) {
      return;
    }

    console.log("✅ Outlook Email opened");
    const subject = emailRow.textContent ? emailRow.textContent.slice(0, 30) : 'Unknown';
    
    safeSendMessage({ 
      type: "EMAIL_OPENED",
      platform: "outlook",
      subject: subject,
      emailId: generateGenericId('outlook', subject)
    });
  }, true);
}

function detectTelegramChatOpen() {
  document.addEventListener('click', (event) => {
    const chatRow = event.target.closest('.ListItem') || 
                    event.target.closest('.chatlist-chat') || 
                    event.target.closest('.ListItem-button') ||
                    event.target.closest('[data-peer-id]');
    if (!chatRow) return;

    console.log("💬 Telegram Chat opened");
    const titleElement = chatRow.querySelector('.title') || chatRow.querySelector('.peer-title');
    const subject = titleElement ? titleElement.textContent : 'Unknown Chat';

    safeSendMessage({ 
      type: "EMAIL_OPENED",
      platform: "telegram",
      subject: subject,
      emailId: generateGenericId('telegram', subject)
    });
  }, true);
}

function detectTeamsChatOpen() {
  document.addEventListener('click', (event) => {
    const chatRow = event.target.closest('[role="treeitem"]') || 
                    event.target.closest('[role="listitem"]') || 
                    event.target.closest('[data-tid^="chat-list-item"]');
    if (!chatRow) return;

    console.log("👥 Teams Chat opened");
    const subject = chatRow.textContent ? chatRow.textContent.slice(0, 30) : 'Unknown Chat';

    safeSendMessage({ 
      type: "EMAIL_OPENED",
      platform: "teams",
      subject: subject,
      emailId: generateGenericId('teams', subject)
    });
  }, true);
}

// --- INITIALIZATION ROUTER ---
const hostname = window.location.hostname;
let currentPlatform = null;

// 1. Identify if we are actually on a supported platform first!
if (hostname.includes('mail.google.com')) currentPlatform = 'gmail';
else if (hostname.includes('outlook.live.com') || hostname.includes('outlook.office.com') || hostname.includes('outlook.cloud.microsoft')) currentPlatform = 'outlook';
else if (hostname.includes('web.telegram.org')) currentPlatform = 'telegram';
else if (hostname.includes('teams.microsoft.com')) currentPlatform = 'teams';

if (currentPlatform) {
  console.log(`🌐 FlagIt Router active on supported platform: ${currentPlatform}`);
  
  // 2. Only check Gatekeeper if we are on a valid platform
  if (chrome.runtime?.id) {
    chrome.runtime.sendMessage({ type: "CHECK_SCANNER_STATE", platform: currentPlatform }, (response) => {
      if (!chrome.runtime.lastError && response?.shouldPrompt) {
        showGatekeeperPrompt(currentPlatform);
      }
    });
  }

  // 3. Attach the relevant listeners
  if (currentPlatform === 'gmail') { detectGmailEmailOpen(); detectInboxView(); }
  else if (currentPlatform === 'outlook') detectOutlookEmailOpen();
  else if (currentPlatform === 'telegram') detectTelegramChatOpen();
  else if (currentPlatform === 'teams') detectTeamsChatOpen();
}

// 4. Update the Gatekeeper UI to send the specific platform when clicked
function showGatekeeperPrompt(platform) {
  if (document.getElementById('flagit-gatekeeper')) return;

  const overlay = document.createElement('div');
  overlay.id = 'flagit-gatekeeper';
  
  // FIXED: Added backticks around the CSS
  overlay.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 999999;
    background: #0a1a2f; color: white; padding: 20px;
    border-radius: 12px; border: 1px solid rgba(34, 211, 238, 0.4);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-family: 'Inter', sans-serif;
    width: 300px; text-align: center; backdrop-filter: blur(10px);
  `;

  // FIXED: Added backticks around the HTML, and removed the stray '}'
  overlay.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 12px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      <h2 style="margin: 0; font-size: 18px; color: #22D3EE; font-weight: bold; letter-spacing: 1px;">FlagIt Security</h2>
    </div>
    <p style="font-size: 13px; line-height: 1.4; margin-bottom: 20px; color: rgba(255,255,255,0.8);">
      Do you want to enable background phishing scanning for ${platform}?
    </p>
    <div style="display: flex; gap: 10px; justify-content: center;">
      <button id="flagit-btn-on" style="background: #F97316; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; flex: 1;">Turn ON</button>
      <button id="flagit-btn-off" style="background: transparent; color: white; border: 1px solid rgba(34, 211, 238, 0.4); padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; flex: 1;">Leave OFF</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('flagit-btn-on').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "SET_SCANNER_STATE", platform: platform, state: "ON" });
    overlay.remove();
  });

  document.getElementById('flagit-btn-off').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "SET_SCANNER_STATE", platform: platform, state: "OFF" });
    overlay.remove();
  });
}

// --- NEW: THREAT WARNING UI ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SHOW_THREAT_WARNING") {
    showThreatAlert(request.subject);
  }
});

function showThreatAlert(subject) {
  if (document.getElementById('flagit-threat-alert')) return;

  const overlay = document.createElement('div');
  overlay.id = 'flagit-threat-alert';
  
  // FIXED: Added backticks around the CSS
  overlay.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 999999;
    background: #7f1d1d; color: white; padding: 20px;
    border-radius: 12px; border: 2px solid #ef4444;
    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4); font-family: 'Inter', sans-serif;
    width: 320px; text-align: left;
    transition: all 0.3s ease;
  `;

  // FIXED: Added backticks around the HTML
  overlay.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
      <div style="background: #ef4444; padding: 8px; border-radius: 50%; display: flex;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      </div>
      <div>
        <h2 style="margin: 0; font-size: 16px; font-weight: bold; color: white;">Phishing Threat Detected!</h2>
        <p style="margin: 2px 0 0 0; font-size: 11px; color: #fca5a5;">FlagIt Security Scanner</p>
      </div>
    </div>
    <p style="font-size: 13px; line-height: 1.4; margin-bottom: 16px; color: #fecaca;">
      Suspicious elements found in: <br/><strong>"${subject.substring(0, 30)}${subject.length > 30 ? '...' : ''}"</strong>
    </p>
    <div style="display: flex; gap: 10px;">
      <button id="flagit-btn-review" style="background: white; color: #7f1d1d; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; flex: 1;">Review Threat</button>
      <button id="flagit-btn-dismiss" style="background: transparent; color: white; border: 1px solid #fca5a5; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; flex: 1;">Dismiss</button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Button Listeners
  document.getElementById('flagit-btn-dismiss').addEventListener('click', () => {
    overlay.remove();
  });

  document.getElementById('flagit-btn-review').addEventListener('click', () => {
    // Attempt to open the extension popup automatically
    chrome.runtime.sendMessage({ type: "OPEN_EXTENSION_POPUP" });
    overlay.remove();
  });
}

window.addEventListener('beforeunload', () => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.remove([STATE_KEY, 'currentEmailId']);
  }
});