// src/content/content.js
console.log("🚀 FlagIt content script loaded on:", window.location.hostname);

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
      const openEmail = document.querySelector('.nH .nH .nH');
      if (!openEmail) {
        chrome.storage.local.set({ currentEmailId: null });
      }
    } catch (e) {
      clearInterval(intervalId);
    }
  }, 1000);
}


// --- PLATFORM DETECTORS ---

// 1. Gmail Detection
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

// 2. Outlook Detection (Precision Mode)
function detectOutlookEmailOpen() {
  document.addEventListener('click', (event) => {
    // 1. Exclude clicks in the left sidebar, top header, and top tabs
    if (
      event.target.closest('nav') || 
      event.target.closest('[role="tree"]') || 
      event.target.closest('[role="banner"]') ||
      event.target.closest('[role="tablist"]')
    ) {
      return;
    }

    // 2. Find the closest list row or list option
    const emailRow = event.target.closest('[role="row"]') || 
                     event.target.closest('[role="option"]');
                     
    if (!emailRow) return;

    // 3. The "Reading Pane" Filter:
    // Regular HTML table rows inside the email body also count as a "row".
    // However, ONLY message list rows will have an aria-selected state or a descriptive aria-label.
    if (!emailRow.hasAttribute('aria-selected') && !emailRow.hasAttribute('aria-label')) {
      return;
    }

    // 4. Ignore clicks on action buttons inside the email row (checkboxes, flags, delete, etc.)
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

// 3. Telegram Detection
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

// 4. Teams Detection
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

if (hostname.includes('mail.google.com')) {
  detectGmailEmailOpen();
  detectInboxView(); 
} else if (hostname.includes('outlook.live.com') || hostname.includes('outlook.office.com') || hostname.includes('outlook.cloud.microsoft')) {
  detectOutlookEmailOpen();
} else if (hostname.includes('web.telegram.org')) {
  detectTelegramChatOpen();
} else if (hostname.includes('teams.microsoft.com')) {
  detectTeamsChatOpen();
}