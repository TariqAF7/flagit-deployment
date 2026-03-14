import React, { useEffect } from 'react';
import './ScanningScreen.css';

export default function ScanningScreen({ setScreen, emailId }) {
  
  // Auto-close after 3 seconds - RE-ENABLED
  useEffect(() => {
    const timer = setTimeout(() => {
      window.close();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePause = () => {
    console.log("⏸️ Pause clicked for email:", emailId);
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      if (emailId) {
        chrome.storage.local.set({ 
          [`paused_${emailId}`]: true,
          lastPausedEmail: emailId,
          scanningState: 'paused'
        }, () => {
          console.log("✅ Paused state saved for email:", emailId);
          setScreen("paused");
        });
      } else {
        setScreen("paused");
      }
    } else {
      setScreen("paused");
    }
  };

  return (
    <div className="scanning-screen-compact">
      <div className="scanning-content-compact">
        <div className="radar-compact">
          <div className="radar-circle-compact"></div>
          <div className="radar-circle-compact inner"></div>
          <div className="radar-line-compact"></div>
        </div>
        <div className="text-compact">
          <h2>FISHING FOR PHISHES...</h2>
        </div>
        <button 
          className="pause-button-compact"
          onClick={handlePause}
        >
          ⏸️ Pause
        </button>
      </div>
    </div>
  );
}