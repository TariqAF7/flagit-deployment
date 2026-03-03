// src/background/background.js
console.log("🚀 FlagIt: Background script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📨 Background received:", request);
  
  if (request.type === "EMAIL_OPENED") {
    console.log(`💬 Message/Email opened: "${request.subject}" on platform: ${request.platform} with ID: ${request.emailId}`);
    
    // Store message info INCLUDING the ID and reset scanning state
    chrome.storage.local.set({ 
      popupReason: 'email_open',
      platform: request.platform,
      subject: request.subject,
      emailId: request.emailId,
      currentEmailId: request.emailId,
      scanningState: 'scanning', 
      timestamp: Date.now()
    }, () => {
      console.log(`✅ Storage set complete for ${request.platform}. ID:`, request.emailId, "State: scanning");
      
      // CRITICAL FIX: Tell the content script we successfully received and saved the data.
      // This closes the communication channel properly and stops the error!
      sendResponse({ status: "success" }); 
    });
    
    console.log("🔍 Attempting to open popup...");
    
    try {
      chrome.action.openPopup(() => {
        if (chrome.runtime.lastError) {
          console.log("❌ openPopup error:", chrome.runtime.lastError.message);
        } else {
          console.log("✅ openPopup succeeded");
        }
      });
    } catch (err) {
      console.log("❌ openPopup exception:", err);
    }
    
    // We return true here to keep the channel open *just* long enough 
    // for the chrome.storage callback above to run sendResponse()
    return true; 
  }
});