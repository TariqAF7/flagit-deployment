import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSimulationById, reportSimulation } from '../api/simulations';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen, faShieldAlt, faCheckCircle, faExclamationTriangle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SimulationViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [feedbackState, setFeedbackState] = useState(null); // { isCorrect, message, isPhishing }

  useEffect(() => {
    fetchSimulationById(id)
      .then(res => {
        setSimulation(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Simulation not found or an error occurred.');
        setLoading(false);
      });
  }, [id]);

  const handleChoice = async (choice) => {
    try {
      const response = await reportSimulation(id, choice);
      setFeedbackState({
        isCorrect: response.isCorrect,
        message: response.message,
        isPhishing: response.isPhishing,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit choice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading simulation...
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'red', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {error}
      </div>
    );
  }

  const { emailContent } = simulation;

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '2rem 1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <button 
          onClick={() => navigate('/simulations')}
          style={{ 
            background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start',
            marginBottom: '1rem', padding: '0.5rem', fontSize: '0.85rem'
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Simulations
        </button>

        {/* The Email Client View */}
        <div style={{ 
          backgroundColor: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155',
          overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', flex: 1, display: 'flex', flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#132B44' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem 0' }}>{emailContent?.subject || 'No Subject'}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: '50%', backgroundColor: '#F97316', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' 
              }}>
                <FontAwesomeIcon icon={faEnvelopeOpen} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{emailContent?.senderName || 'Unknown Sender'}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>&lt;{emailContent?.senderEmail || 'no-reply@unknown.com'}&gt;</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ 
            padding: '2rem', flex: 1, backgroundColor: '#ffffff', color: '#1e293b', 
            fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' 
          }}>
            {emailContent?.body || 'No content provided for this simulation.'}
          </div>

          {/* Action Bar */}
          <div style={{ padding: '1.5rem', borderTop: '1px solid #334155', display: 'flex', gap: '1rem', background: '#0f172a' }}>
            <button 
              onClick={() => handleChoice('legit')}
              style={{
                flex: 1, padding: '1rem', borderRadius: '0.5rem', border: 'none',
                backgroundColor: '#3b82f6', color: 'white', fontWeight: 600, fontSize: '1rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              <FontAwesomeIcon icon={faCheckCircle} /> Mark as Legitimate
            </button>
            <button 
              onClick={() => handleChoice('phish')}
              style={{
                flex: 1, padding: '1rem', borderRadius: '0.5rem', border: 'none',
                backgroundColor: '#ef4444', color: 'white', fontWeight: 600, fontSize: '1rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              <FontAwesomeIcon icon={faShieldAlt} /> Report Phishing
            </button>
          </div>
        </div>
      </main>

      {/* Feedback Modal */}
      {feedbackState && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)', padding: '1rem'
        }}>
          <div style={{
             backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2.5rem', maxWidth: '500px', width: '100%',
             textAlign: 'center', border: `2px solid ${feedbackState.isCorrect ? '#22c55e' : '#ef4444'}`
          }}>
             <FontAwesomeIcon 
               icon={feedbackState.isCorrect ? faCheckCircle : faExclamationTriangle} 
               style={{ fontSize: '3.5rem', color: feedbackState.isCorrect ? '#22c55e' : '#ef4444', marginBottom: '1rem' }} 
             />
             <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>
               {feedbackState.isCorrect ? 'Correct!' : 'Incorrect'}
             </h2>
             <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '2rem', lineHeight: 1.5 }}>
               {feedbackState.message}
             </p>
             <button 
               onClick={() => navigate('/simulations')}
               style={{
                 padding: '0.75rem 2rem', borderRadius: '2rem', border: 'none',
                 backgroundColor: '#F97316', color: 'white', fontWeight: 600, cursor: 'pointer',
                 fontSize: '1rem'
               }}
             >
               Return to Dashboard
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationViewer;
