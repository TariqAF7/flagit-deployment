import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faArrowLeft, faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';
import './ThreatScreen.css';

export default function ThreatScreen({ setScreen }) {
  return (
    <div className="threat-screen">
      <div className="header">
        <div className="logo-container">
          <div className="logo-box warning-box">
            <img src="/icons/flagit-logo.png" alt="FlagIt" />
          </div>
          <div className="logo-text">
            <h1>FlagIt</h1>
            <p className="text-red">Security Alert Triggered</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="danger-container">
          <div className="danger-icon">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
          <h2>THREAT DETECTED</h2>
          <p className="status-text">
            This message exhibits strong indicators of a phishing attempt.
          </p>
        </div>

        <div className="threat-details">
          <div className="threat-item">
            <span className="dot"></span>
            <p><strong>Urgent Language:</strong> Attempts to create false panic.</p>
          </div>
          <div className="threat-item">
            <span className="dot"></span>
            <p><strong>Suspicious Sender:</strong> Domain does not match official records.</p>
          </div>
          <div className="threat-item">
            <span className="dot"></span>
            <p><strong>Hidden Links:</strong> Destination obscures the true URL.</p>
          </div>
        </div>
      </div>
      
      <div className="actions">
        <button className="btn-primary-danger" onClick={() => window.open('http://localhost:5173', '_blank')}>
          <FontAwesomeIcon icon={faMagnifyingGlassChart} style={{ marginRight: '8px' }}/>
          View Full Report
        </button>
        <button 
          className="btn-secondary-danger" 
          onClick={() => {
            if (typeof chrome !== 'undefined' && chrome.tabs && chrome.storage) {
              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].url) {
                  const domain = new URL(tabs[0].url).hostname;
                  const STATE_KEY = `scanningState_${domain}`;
                  chrome.storage.local.set({ [STATE_KEY]: 'safe' });
                }
                setScreen('platformList');
              });
            } else {
              setScreen('platformList');
            }
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }}/>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}