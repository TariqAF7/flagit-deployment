export default function AnalysisScreen({ setScreen }) {

  return (
    <div className="detector-card">

      <h2>Phishing Detected</h2>

      <ul>
        <li>Urgency & Threat detected</li>
        <li>Generic greeting</li>
        <li>Suspicious sender domain</li>
        <li>Malicious link detected</li>
      </ul>

      <button
        onClick={() => setScreen("reported")}
      >
        Report Email
      </button>

      <button>
        Close
      </button>

    </div>
  );
}