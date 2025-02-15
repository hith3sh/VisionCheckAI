import React, { useState } from 'react';
import "./errorPopup.css"


function ErrorPopup({ message, onClose }) {
    const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };
  return (
    <div className="error-popup">
      <div className="error-content">
        <p>{message}</p>
        <span className="close" onClick={handleClose}>&times;</span>
      </div>
    </div>
    
  );
}

export default ErrorPopup;
