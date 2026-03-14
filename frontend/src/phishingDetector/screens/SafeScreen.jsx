import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import './SafeScreen.css';

export default function SafeScreen() {
  return (
    <div className="safe-screen">
      <div className="header">
        <div className="logo-container">
          <div className="logo-box safe-box">
            <img src="/icons/flagit-logo.png" alt="FlagIt" />
          </div>
          <div className="logo-text">
            <h1>FlagIt</h1>
            <p className="text-green">Security Scan Complete</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="safe-container">
          <div className="safe-icon">
            <FontAwesomeIcon icon={faCircleCheck} />
          </div>
          <h2>NO THREATS DETECTED</h2>
          <p className="status-text">
            This message appears safe. No phishing indicators were found during the scan.
          </p>
        </div>
      </div>
    </div>
  );
}