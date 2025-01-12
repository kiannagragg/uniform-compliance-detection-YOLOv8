// src/components/IconDisplay.jsx
import React from 'react';
import '../styles/IconDisplay.css';

const IconDisplay = ({ name, isActive }) => {
  return (
    <div className={`icon-display ${isActive ? 'active' : ''}`}>
      <div className="icon-wrapper">
        <img
          src={`/icons/${name}.png`}
          alt={name}
          className="icon-image"
        />
      </div>
      <span className="icon-label">{name}</span>
    </div>
  );
};

export default IconDisplay;
