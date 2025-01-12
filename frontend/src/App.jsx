import React, { useState, useEffect } from "react";
import VideoFeed from "./components/VideoFeed";
import "./styles/App.css";

const App = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [showStartScreen, setShowStartScreen] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString());
      setCurrentTime(now.toLocaleTimeString());
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      await fetch("http://localhost:5000/start_camera", { method: "POST" });
      setShowStartScreen(false); // Proceed to the main app screen
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  const handleExit = async () => {
    try {
      await fetch("http://localhost:5000/stop_camera", { method: "POST" });
      setShowStartScreen(true); // Switch back to the start screen
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  if (showStartScreen) {
    return (
      <div className="start-screen">
        <header className="header">
          <img src="/icons/tup.png" alt="Logo" className="logo" />
          <div className="header-text">
            <h2>Uniform Compliance Detection System</h2>
            <p>Technological University of the Philippines - Manila</p>
          </div>
        </header>
        <div className="start-content">
          <div className="welcome-container">
            <h1>
              Welcome to{" "}
              <span
                style={{
                  color: "#620D0F",
                  fontStyle: "italic",
                  fontWeight: "bold",
                }}
              >
                Fitcheck
              </span>
            </h1>
            <p>Real-time University Uniform Compliance Detection System</p>
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEjRCFnVHSwNOrEVraHPBvhCiiKOjKTJBIZtfrzAyTPr4lGkDp3DV0ASzf1Gr30hxvwFuFaeLZ5dF7zjA6b1RSnLlVJ0GXFdr3ikKp3csvnq9hS-Ua8ZJRb1LBTHJwbXrGR77tCY7gC2Wx0u8K7RwZF-I3PLfdoBe9wA-Lz0rzsPNWS7s3gWWC67T3UXSg"
              alt="Uniform Icon"
              class="uniform"
            />
          </div>
          <button className="start-button" onClick={handleStart}>
            START
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <img src="/icons/tup.png" alt="Logo" className="logo" />
        <div className="header-text">
          <h2>Uniform Compliance Detection System</h2>
          <p>Technological University of the Philippines - Manila</p>
        </div>
      </header>
      <main className="main-container">
        <VideoFeed />
        <footer className="footer">
          <span className="date">Date: {currentDate}</span>
          <span className="time">Time: {currentTime}</span>
          <button className="exit-button" onClick={handleExit}>
            EXIT
          </button>
        </footer>
      </main>
    </div>
  );
};

export default App;