import { useState, useEffect } from "react";
import StartScreen from "../screens/StartScreen";
import PlatformListViewScreen from "../screens/PlatformListViewScreen";
import ScanningScreen from "../screens/ScanningScreen";
import PausedScreen from "../screens/PausedScreen";

export default function DetectorContainer({ onScreenChange }) {
  const [screen, setScreen] = useState("start");
  const [currentEmailId, setCurrentEmailId] = useState(null);
  const [platform, setPlatform] = useState("gmail");

  useEffect(() => {
    if (onScreenChange) onScreenChange(screen);
  }, [screen, onScreenChange]);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['popupReason', 'scanningState', 'currentEmailId'], (result) => {
        setCurrentEmailId(result.currentEmailId);
        
        // STEP 1: If triggered by a click inside an email/chat
        if (result.popupReason === 'email_open') {
          setScreen("scanning");
          chrome.storage.local.remove('popupReason');
          return;
        }
        
        // STEP 2: Check URL to determine the app
        if (chrome.tabs) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentUrl = tabs[0]?.url || '';
            
            const isGmail = currentUrl.includes('mail.google.com');
            const isOutlook = currentUrl.includes('outlook.live.com') || currentUrl.includes('outlook.office.com') || currentUrl.includes('outlook.cloud.microsoft');
            const isTelegram = currentUrl.includes('web.telegram.org');
            const isTeams = currentUrl.includes('teams.microsoft.com');
            
            // If outside supported apps, show main StartScreen
            if (!isGmail && !isOutlook && !isTelegram && !isTeams) {
              setScreen("start");
              return;
            }

            // Set dynamic platform state
            let currentPlatform = 'gmail';
            if (isOutlook) currentPlatform = 'outlook';
            if (isTelegram) currentPlatform = 'telegram';
            if (isTeams) currentPlatform = 'teams';
            setPlatform(currentPlatform);
            
            // For Gmail, check the URL hash - ALL FOLDERS from your list
            if (isGmail) {
              const urlHash = currentUrl.split('#')[1] || '';
              
              // Complete list of all Gmail folders based on your console output
              const isListView = 
                urlHash === 'inbox' ||                // Inbox
                urlHash === 'starred' ||              // Starred
                urlHash === 'snoozed' ||              // Snoozed
                urlHash === 'sent' ||                  // Sent
                urlHash === 'drafts' ||                // Drafts
                urlHash === 'imp' ||                   // Important
                urlHash === 'scheduled' ||             // Scheduled
                urlHash === 'all' ||                    // All Mail
                urlHash === 'spam' ||                   // Spam
                urlHash === 'trash' ||                  // Bin/Trash
                urlHash.startsWith('category/') ||      // Categories (purchases, social, etc.)
                urlHash.startsWith('label/') ||         // Custom labels
                urlHash.startsWith('search/') ||        // Search results
                urlHash === '';                          // Default view
              
              if (isListView) {
                console.log(`📬 In Gmail list view: ${urlHash || 'inbox'} - showing Armed & Ready`);
                setScreen("platformList");
                return;
              }
              
              // If we're here, we're in an email
              console.log("📧 In Gmail email view");
            } else {
              // For other platforms, assume we're in list view by default
              setScreen("platformList");
              return;
            }
            
            // Show paused screen if applicable
            if (result.scanningState === 'paused') {
              setScreen("paused");
              return;
            }
            
            // Default to scanning if we're in an email/chat
            setScreen("scanning");
          });
        }
      });
    }
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case "scanning": return <ScanningScreen setScreen={setScreen} emailId={currentEmailId} />;
      case "paused": return <PausedScreen setScreen={setScreen} emailId={currentEmailId} />;
      case "platformList": return <PlatformListViewScreen setScreen={setScreen} platform={platform} />;
      default: return <StartScreen setScreen={setScreen} />;
    }
  };

  return <div className="detector-container">{renderScreen()}</div>;
}