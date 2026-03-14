export default function ReportSuccessScreen({ setScreen }) {

  return (
    <div className="detector-card">

      <h2>Successfully Reported</h2>

      <button
        onClick={() => setScreen("start")}
      >
        Done
      </button>

    </div>
  );
}