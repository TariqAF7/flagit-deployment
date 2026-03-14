import { useState, useEffect } from "react";
import StartScreen from "../screens/StartScreen";
import PlatformListViewScreen from "../screens/PlatformListViewScreen";
import ScanningScreen from "../screens/ScanningScreen";
import PausedScreen from "../screens/PausedScreen";
import ThreatScreen from "../screens/ThreatScreen"; 
import SafeScreen from "../screens/SafeScreen";

export default function DetectorContainer({ onScreenChange }) {
  const [screen, setScreen] = useState("start");
  const [currentEmailId, setCurrentEmailId] = useState(null);
  const [platform, setPlatform] = useState("gmail");

  useEffect(() => {
    if (onScreenChange) onScreenChange(screen);
  }, [screen, onScreenChange]);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.storage) {
      // Get the global triggers first
      chrome.storage.local.get(['popupReason', 'currentEmailId'], (initialResult) => {
        setCurrentEmailId(initialResult.currentEmailId);
        
        // Handle Clicks and Scans
        if (initialResult.popupReason === 'email_open') {
          setScreen("scanning");
          chrome.storage.local.remove('popupReason');
          return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentUrl = tabs[0]?.url || '';
          
          if (!currentUrl) {
            setScreen("start");
            return;
          }

          try {
            const urlObj = new URL(currentUrl);
            const domain = urlObj.hostname;
            
            const STATE_KEY = `scanningState_${domain}`;

            const isGmail = currentUrl.includes('mail.google.com');
            const isOutlook = currentUrl.includes('outlook.live.com') || currentUrl.includes('outlook.office.com') || currentUrl.includes('outlook.cloud.microsoft');
            const isTelegram = currentUrl.includes('web.telegram.org');
            const isTeams = currentUrl.includes('teams.microsoft.com');
            
            if (!isGmail && !isOutlook && !isTelegram && !isTeams) {
              setScreen("start");
              return;
            }

            let currentPlatform = 'gmail';
            if (isOutlook) currentPlatform = 'outlook';
            if (isTelegram) currentPlatform = 'telegram';
            if (isTeams) currentPlatform = 'teams';
            setPlatform(currentPlatform);
            
            // Fetch the specific memory state for THIS domain
            chrome.storage.local.get([STATE_KEY], (domainResult) => {
              const state = domainResult[STATE_KEY];

              if (state === 'paused') { setScreen("paused"); return; }
              if (state === 'threat_found') { setScreen("threat"); return; }
              if (state === 'safe') { setScreen("safe"); return; }
              
              setScreen("platformList");
            });

          } catch (e) {
            setScreen("start");
          }
        });
      });
    }
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case "scanning": return <ScanningScreen setScreen={setScreen} emailId={currentEmailId} />;
      case "paused": return <PausedScreen setScreen={setScreen} emailId={currentEmailId} />;
      case "threat": return <ThreatScreen setScreen={setScreen} emailId={currentEmailId} />; 
      case "safe": return <SafeScreen setScreen={setScreen} />;
      case "platformList": return <PlatformListViewScreen setScreen={setScreen} platform={platform} />;
      default: return <StartScreen setScreen={setScreen} />;
    }
  };

  return <div className="detector-container">{renderScreen()}</div>;
}