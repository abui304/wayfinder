import './Itinerary.css';
import React, { useState } from 'react';
import Activity from './Activity';

const timeToMinutes = (timeStr) => {
    if (typeof timeStr !== 'string' || !timeStr.trim()) {
        return NaN;
    }
    
    const [time, period] = timeStr.toUpperCase().split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    
    if (isNaN(hours) || isNaN(minutes)) {
        return NaN;
    }

    return hours * 60 + minutes;
};

function ItineraryDayCalendar({ activities, dayNumber }) {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
    };
    const handleCloseModal = () => {
        setSelectedActivity(null);
    };


    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const period = i < 12 || i === 24 ? 'AM' : 'PM';
        return `${hour}:00 ${period}`;
    });

    const scheduledActivities = activities.map(activity => {
        const [startStr, endStr] = activity.timeSlot.split(' - ').map(s => s.trim());
        const startMinutes = timeToMinutes(startStr);
        const endMinutes = timeToMinutes(endStr);
            
        // Calculate height and top position for CSS using a base of 60px per hour
        const durationMinutes = endMinutes - startMinutes;
        const totalDayMinutes = 24 * 60; // 1440 minutes in a day

        // If your grid container is 1440px tall (1px per minute)
        const topPosition = (startMinutes / totalDayMinutes) * 100; // in percentage
        const height = (durationMinutes / totalDayMinutes) * 100; // in percentage

        return {
            ...activity,
            top: topPosition,
            height: height,
        };
    });

    return (
        <div className="itinerary-calendar-container">
            <h2>Day {dayNumber} Itinerary</h2>
            
            <div className="calendar-grid">
                {/* Time Column */}
                <div className="time-column">
                    {timeSlots.map((time, index) => (
                        <div key={index} className="time-slot-label">
                            {time}
                        </div>
                    ))}
                </div>

                {/* Activities Column (The Timeline) */}
                <div className="activities-column">
                    {/* Render hour lines */}
                    {timeSlots.map((_, index) => (
                        <div key={`line-${index}`} className="hour-line"></div>
                    ))}

                    {/* Render Activity Blocks */}
                    {scheduledActivities.map((activity, index) => (
                        <div
                            key={index}
                            className="activity-block"
                            style={{
                                // Position the block absolutely within the activities-column
                                top: `${activity.top}%`, 
                                height: `${activity.height}%`,
                            }}
                            onClick={() => handleActivityClick(activity)}
                        >
                            <div className="activity-name">{activity.name}</div>
                            <div className="activity-times">{activity.timeSlot}</div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedActivity && (
                <div className="activity-modal-overlay" onClick={handleCloseModal}>
                    <div className="activity-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                        <Activity activity={selectedActivity} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ItineraryDayCalendar;