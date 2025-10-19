import React from 'react';
import Activity from './Activity'; 
import './ActivityModal.css';  

const ActivityModal = ({ isOpen, onClose, activity }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        
        <Activity activity={activity} />
      </div>
    </div>
  );
};

export default ActivityModal;