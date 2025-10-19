import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Calendar.css";
import TripNavBar from "../components/TripNavBar";
import ItineraryDayCalendar from "../components/Itinerary"; 

const PLANET_MAP = [
  { name: "Mercury", color: "#a7a6a2" },
  { name: "Venus", color: "#d4af37" },
  { name: "Earth", color: "#2e8b57" },
  { name: "Mars", color: "#b22222" },
  { name: "Jupiter", color: "#e1b382" },
  { name: "Saturn", color: "#c2b280" },
  { name: "Neptune", color: "#4169e1" },
  { name: "Uranus", color: "#afeeee" },
  { name: "Pluto", color: "#374151" }, 
  { name: "Eris", color: "#6a0dad" }, 
];
const MAX_DAYS_DISPLAY = 10;

function Calendar() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(null); 
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItinerary = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const res = await axios.get(
          "http://localhost:6969/api/itinerary/latest", 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const latestItinerary = res.data;
        setItinerary(latestItinerary);
        
        // Set the first day as active within the display limit
        if (latestItinerary.days.length > 0) {
            setActiveDay(latestItinerary.days[0].dayNumber);
        }

      } catch (err) {
        const errorMessage = err.response?.data?.msg || "Failed to load itinerary. Please generate a new trip.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItinerary();
  }, [navigate]); 

  
  if (loading) {
    return (
        <>
            <TripNavBar />
            <div className="calendar-container loading">Loading your cosmic itinerary...</div>
        </>
    );
  }
  
  if (error) {
    return (
        <>
            <TripNavBar />
            <div className="calendar-container error">Error: {error}</div>
        </>
    );
  }

  if (!itinerary || itinerary.days.length === 0) {
    return (
        <>
            <TripNavBar />
            <div className="calendar-container error">
                <p>No recent itinerary found. Go to the Trip Builder to create your first journey!</p>
            </div>
        </>
    );
  }

  // Slice the itinerary days to enforce the display limit (max 10 planets)
  const tripDays = itinerary.days
    .slice(0, MAX_DAYS_DISPLAY) 
    .map((day, index) => ({
      ...day,
      planet: PLANET_MAP[index] || { name: `Day ${day.dayNumber}`, color: '#666' } 
  }));
  
  const currentDayActivities = tripDays.find(day => day.dayNumber === activeDay);

  return (
    <>
      <TripNavBar destination={itinerary.destination} />
      <div className="calendar-container">
        <h1 className="calendar-title">
           {itinerary.destination} Itinerary ({itinerary.days.length} Days)
        </h1>
        
        <div className="planet-row">
          {tripDays.map((day) => (
            <div
              key={day.dayNumber}
              className={`planet ${day.dayNumber === activeDay ? "active" : ""}`}
              style={{ backgroundColor: day.planet.color }}
              onClick={() => setActiveDay(day.dayNumber)}
              data-planet-name={day.planet.name}
            >
              <span className="day-label">Day {day.dayNumber}</span>
            </div>
          ))}
        </div>
        
        <div className="daily-itinerary-display">
            {currentDayActivities && (
                <ItineraryDayCalendar 
                    activities={currentDayActivities.activities} 
                    dayNumber={currentDayActivities.dayNumber} 
                />
            )}
        </div>
        
        {itinerary.days.length > MAX_DAYS_DISPLAY && (
             <p className="day-limit-note">
                Display limited to the first {MAX_DAYS_DISPLAY} days.
             </p>
        )}

      </div>
    </>
  );
}

export default Calendar;