import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, faEnvelope, faStar, faFlag, 
  faPaperPlane, faFileAlt, faBan, faComments, faCommentDots, faUsers 
} from '@fortawesome/free-solid-svg-icons';
import './PlatformListViewScreen.css'; // Don't forget to rename your CSS file too!

export default function PlatformListViewScreen({ setScreen, platform }) {
  
  // Dynamic config based on the detected platform
  const getPlatformFeatures = () => {
    switch(platform) {
      case 'telegram':
        return [{ icon: faComments, label: 'Chats' }];
      case 'teams':
        return [
          { icon: faCommentDots, label: 'Chat' },
          { icon: faUsers, label: 'Teams' }
        ];
      case 'outlook':
        return [
          { icon: faEnvelope, label: 'Inbox' },
          { icon: faPaperPlane, label: 'Sent Items' },
          { icon: faFileAlt, label: 'Drafts' },
          { icon: faBan, label: 'Junk Email' }
        ];
      case 'gmail':
      default:
        return [
          { icon: faEnvelope, label: 'Inbox' },
          { icon: faStar, label: 'Starred' },
          { icon: faPaperPlane, label: 'Sent' },
          { icon: faFlag, label: 'Spam' }
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
          <div className="shield-icon">
            <FontAwesomeIcon icon={faShieldHalved} style={{ color: "#F97316" }} />
          </div>
          <h2>ARMED & READY</h2>
          <p className="status-text">To detect phishes in your {targetText}</p>
        </div>

        {/* Dynamically mapped icons */}
        <div className="feature-icons">
          {features.map((item, index) => (
            <div className="feature-item" key={index}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={() => window.open('http://localhost:5173', '_blank')}>
            Go to Website
          </button>
        </div>
      </div>
    </div>
  );
}