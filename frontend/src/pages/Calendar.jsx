import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Calendar.css";
import TripNavBar from "../components/TripNavBar";
import ItineraryDayCalendar from "../components/Itinerary"; 
import mercury from "../assets/planets/mercury.png";
import venus from "../assets/planets/venus.png";
import earth from "../assets/planets/earth.png";
import mars from "../assets/planets/mars.png";
import jupiter from "../assets/planets/jupiter.png";
import saturn from "../assets/planets/saturn.png";
import neptune from "../assets/planets/neptune.png";
import uranus from "../assets/planets/uranus.png";
import pluto from "../assets/planets/pluto.png";
import eris from "../assets/planets/eris.png";

const PLANET_MAP = [
  { name: "Mercury", img: mercury },
  { name: "Venus", img: venus },
  { name: "Earth", img: earth },
  { name: "Mars", img: mars },
  { name: "Jupiter", img: jupiter },
  { name: "Saturn", img: saturn },
  { name: "Neptune", img: neptune },
  { name: "Uranus", img: uranus },
  { name: "Pluto", img: pluto },
  { name: "Eris", img: eris },
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
      <div className="calendar-container">
        <h1 className="calendar-title">
           {itinerary.destination} Itinerary ({itinerary.days.length} Days)
        </h1>
        
        <div className="planet-row">
            {tripDays.map((day) => (
                <div
                key={day.dayNumber}
                className={`planet ${day.dayNumber === activeDay ? "active" : ""}`}
                onClick={() => setActiveDay(day.dayNumber)}
                data-planet-name={day.planet.name}
                >
                <img
                    src={day.planet.img}
                    alt={day.planet.name}
                    className="planet-img"
                />
                <span className="planet-label">{day.planet.name}</span>
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