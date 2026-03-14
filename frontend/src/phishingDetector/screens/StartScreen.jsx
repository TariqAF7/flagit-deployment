import React from 'react';
import './StartScreen.css';

export default function StartScreen() {
  return (
    <div className="start-screen">
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

      <div className="idle-content">
        <img src="/icons/NoPhish.png" alt="Nothing to scan" className="hero-image" />

        <h2 style={{ color: "#22D3EE" }}>NOTHING TO PHISH 😴</h2>
        <p className="status-text" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
          FlagIt stays quiet until you open a supported platform.
        </p>
      </div> 

      <div className="actions">
        <button className="btn-secondary" onClick={() => window.open('http://localhost:5173', '_blank')}>
          Go to Website
        </button>
      </div>
    </div>
  );
}