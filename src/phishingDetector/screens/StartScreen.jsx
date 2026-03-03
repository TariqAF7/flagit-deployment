import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faTelegram, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faSatelliteDish, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './StartScreen.css';

export default function StartScreen({ setScreen }) {
  return (
    <div className="start-screen">
      {/* Header with Custom Logo */}
      <div className="header">
        <div className="logo-container">
          <div className="logo-box">
            <img 
              src="/icons/flagit-logo.png" 
              alt="FlagIt" 
            />
          </div>
          <div className="logo-text">
            <h1>FlagIt</h1>
            <p>Outsmarting Phishing, Together.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="radar-container">
          <div className="radar-icon">
            <FontAwesomeIcon icon={faSatelliteDish} style={{ color: "#F97316" }} />
          </div>
          <h2>Start Fishing for Phishes</h2>
          <div className="radar-pulse"></div>
        </div>

        {/* Platform Icons */}
        <div className="platforms">
          <div className="platform-icon">
            <FontAwesomeIcon icon={faGoogle} />
            <span>Gmail</span>
          </div>
          <div className="platform-icon">
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Outlook</span>
          </div>
          <div className="platform-icon">
            <FontAwesomeIcon icon={faTelegram} />
            <span>Telegram</span>
          </div>
          <div className="platform-icon">
            <FontAwesomeIcon icon={faMicrosoft} />
            <span>Teams</span>
          </div>
        </div>

{/* Action Buttons */}
<div className="actions">
  <button 
    className="btn-primary"
    onClick={() => setScreen("scanning")}
  >
    View Scanner Status  {/* ← NEW TEXT */}
  </button>
  
  <button 
    className="btn-secondary"
    onClick={() => window.open('http://localhost:5173', '_blank')}
  >
    Go to Website
  </button>
</div>
      </div>
    </div>
  );
}