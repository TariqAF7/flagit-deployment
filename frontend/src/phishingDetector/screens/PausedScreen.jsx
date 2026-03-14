import React, { useEffect } from 'react';
import './PausedScreen.css';

export default function PausedScreen({ setScreen, emailId }) {
  
  // Auto-close after 3 seconds - RE-ENABLED
  useEffect(() => {
    const timer = setTimeout(() => {
      window.close();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleResume = () => {
    console.log("▶️ Resume clicked for email:", emailId);
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      if (emailId) {
        chrome.storage.local.set({ 
          [`paused_${emailId}`]: false,
          scanningState: 'scanning',
          lastResumedEmail: emailId
        }, () => {
          console.log("✅ Resume state saved for email:", emailId);
          setScreen("scanning");
        });
      } else {
        setScreen("scanning");
      }
    } else {
      setScreen("scanning");
    }
  };

  return (
    <div className="paused-screen-compact">
      <div className="paused-content-compact">
        <div className="radar-paused">
          <div className="radar-circle-paused"></div>
          <div className="radar-circle-paused inner"></div>
          <div className="radar-line-paused"></div>
        </div>
        <div className="text-paused">
          <h2>FISHING FOR PHISHES (PAUSED)</h2>
        </div>
        <button 
          className="resume-button-compact"
          onClick={handleResume}
        >
          ▶️ Resume
        </button>
      </div>
    </div>
  );
}