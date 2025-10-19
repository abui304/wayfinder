import React from 'react';
import './Activity.css'; // Import the stylesheet

const Activity = ({ activity }) => {
  const imageUrl = activity.imageUrl || `https://placehold.co/200x150/e2e8f0/475569?text=Activity`;

  return (
    <div className="activity-card">
      <img
        className="activity-image"
        src={imageUrl}
        alt={activity.summary}
      />
      <div className="activity-content">
        <div className="activity-details">
          <p className="activity-timeslot"><strong>Time:</strong> {activity.timeSlot}</p>
          <h2 className="activity-name">{activity.name}</h2>
          <p className="activity-summary">{activity.summary}</p>
          <p className="activity-location"><strong>Location:</strong> {activity.location}</p>
        </div>
        <div className="activity-cost">
          <p>${activity.cost}</p>
        </div>
      </div>
    </div>
  );
};

export default Activity;

