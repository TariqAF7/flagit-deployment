import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PopupApp from "./phishingDetector/PopupApp.jsx";
// Only import popup-specific styles
import "./phishingDetector/styles/popup.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PopupApp />
  </StrictMode>
);