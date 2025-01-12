import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import IconDisplay from "./IconDisplay";
import "../styles/VideoFeed.css";

const socket = io("http://localhost:5000"); 

const VideoFeed = () => {
  const [detectedItems, setDetectedItems] = useState([]);
  const [status, setStatus] = useState("--");
  const [videoKey, setVideoKey] = useState(Date.now()); // Unique key to force video reload

  const uniformComponents = [
    "uniformTop",
    "uniformBottom",
    "id",
    "logo",
    "black shoes",
  ];

  useEffect(() => {
    socket.on("detection_data", (data) => {
      const detection = JSON.parse(data);
      setDetectedItems(detection.detected || []);
      setStatus(detection.status.toUpperCase());
    });

    return () => {
      socket.off("detection_data");
    };
  }, []);

  useEffect(() => {
    // Force video feed reload when the component mounts or re-renders
    setVideoKey(Date.now());
  }, []);

  return (
    <div className="video-feed-layout">
      <div className="video-container">
        <img
          key={videoKey}
          className="video-stream"
          src={`http://localhost:5000/video_feed?timestamp=${videoKey}`} // Add timestamp to force reload
          alt="Video Feed"
        />
      </div>
      <div className="details-container-wrapper">
        <div className="details-container">
          <div className="status">
            <h3>Status: {status}</h3>
          </div>
        </div>
        <div className="details-container2">
          <div className="icons-container">
            <div className="label">
              <h3>Detected Objects</h3>
            </div>
            {uniformComponents.map((component) => (
              <IconDisplay
                key={component}
                name={component}
                isActive={detectedItems.includes(component)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;