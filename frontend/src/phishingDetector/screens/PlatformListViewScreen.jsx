import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, faEnvelope, faStar, faFlag, faArchive, 
  faComments, faCommentDots, faUsers 
} from '@fortawesome/free-solid-svg-icons';
import './PlatformListViewScreen.css';

export default function PlatformListViewScreen({ setScreen, platform }) {
  const [isScanning, setIsScanning] = useState(true);

  // 1. Check current scanner state for THIS SPECIFIC PLATFORM
  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.local.get(['scannerStates'], (data) => {
        const states = data.scannerStates || {};
        if (states[platform] === 'OFF') {
          setIsScanning(false);
        }
      });
    }
  }, [platform]);

  // 2. The Power Button Toggle (Now includes 'platform' in the payload)
  const toggleScanner = () => {
    const newState = isScanning ? 'OFF' : 'ON';
    setIsScanning(!isScanning);
    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage({ 
        type: "SET_SCANNER_STATE", 
        platform: platform, 
        state: newState 
      });
    }
  };
  
  const getPlatformFeatures = () => {
    switch(platform) {
      case 'telegram': return [{ icon: faComments, label: 'Chats' }];
      case 'teams': return [{ icon: faCommentDots, label: 'Chat' }, { icon: faUsers, label: 'Teams' }];
      case 'outlook': return [
          { icon: faEnvelope, label: 'Inbox' }, { icon: faStar, label: 'Important' },
          { icon: faArchive, label: 'Archive' }, { icon: faFlag, label: 'Junk Email' }
        ];
      case 'gmail':
      default: return [
          { icon: faEnvelope, label: 'Inbox' }, { icon: faStar, label: 'Starred' },
          { icon: faArchive, label: 'All folders' }, { icon: faFlag, label: 'Spam' }
        ];
    }
  };

  const features = getPlatformFeatures();
  const targetText = (platform === 'telegram' || platform === 'teams') ? 'messages' : 'inbox';

  return (
    <div className="platform-list-screen">
      <div className="header">
        <div className="logo-container">
          <div className="logo-box">
            <img src="/icons/flagit-logo.png" alt="FlagIt" />
          </div>
          <div className="logo-text">
            <h1>FlagIt</h1>
            <p>Outsmarting Phishing, Together.</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="shield-container">
          <div 
            className={`shield-icon ${!isScanning ? 'power-off' : ''}`}
            onClick={toggleScanner}
            title={isScanning ? "Click to turn OFF" : "Click to turn ON"}
          >
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          
          <h2 style={{ color: isScanning ? "#22D3EE" : "#64748b" }}>
            {isScanning ? "ARMED & READY" : "SCANNER PAUSED"}
          </h2>
          <p className="status-text" style={{ color: isScanning ? "rgba(255, 255, 255, 0.7)" : "#ef4444" }}>
            {isScanning ? `To detect phishes in your ${targetText}` : "Protection is disabled for this site."}
          </p>
        </div>

        <div className="feature-icons" style={{ opacity: isScanning ? 1 : 0.4, pointerEvents: isScanning ? 'auto' : 'none' }}>
          {features.map((item, index) => (
            <div className="feature-item" key={index}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div> 

      <div className="actions">
        <button className="btn-secondary" onClick={() => window.open('http://localhost:5173', '_blank')}>
          Go to Website
        </button>
      </div>
    </div>
  );
}