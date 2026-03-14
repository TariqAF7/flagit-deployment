export default function PermissionsScreen({ setScreen }) {

  return (
    <div className="detector-card">

      <h2>Outsmarting Phishing, Together.</h2>

      <p>
        FlagIt combines advanced AI detection with personalized training
        to help defend against phishing threats.
      </p>

      <button
        className="primary-button"
        onClick={() => setScreen("scanning")}
      >
        Allow Permissions
      </button>

    </div>
  );
}