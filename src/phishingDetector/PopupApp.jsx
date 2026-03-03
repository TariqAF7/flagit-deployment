import React, { useState, useEffect } from "react";
import DetectorContainer from "./components/DetectorContainer";
import "./styles/popup.css";

export default function PopupApp() {
  const [currentScreen, setCurrentScreen] = useState("start");

  // Force body to resize with popup and strip default margins
  useEffect(() => {
    const size = getPopupSize();
    console.log(`📏 Resizing to: ${size.width} x ${size.height} for screen: ${currentScreen}`);
    
    // 1. Wipe out default Chrome margins and hide scrollbars
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.overflow = "hidden";

    // 2. Set strict sizes
    document.body.style.width = size.width;
    document.body.style.height = size.height;
    document.documentElement.style.width = size.width;
    document.documentElement.style.height = size.height;
  }, [currentScreen]);

  const handleScreenChange = (screen) => {
    console.log("📢 PopupApp received screen change:", screen);
    setCurrentScreen(screen);
  };

  const getPopupSize = () => {
    switch (currentScreen) {
      case "scanning":
        return { width: "380px", height: "70px" }; 
      case "paused":
        return { width: "440px", height: "70px" }; 
      case "platformList":
        return { width: "400px", height: "540px" }; 
      case "start":
      default:
        return { width: "400px", height: "540px" }; 
    }
  };

  const size = getPopupSize();

  return (
    <div style={{ 
      width: "100%",
      height: "100%",
      backgroundColor: "#0a1a2f",
      overflow: "hidden",      // <-- Stops content from spilling out
      boxSizing: "border-box"  // <-- Prevents internal padding from breaking the height
    }}>
      <DetectorContainer onScreenChange={handleScreenChange} />
    </div>
  );
}