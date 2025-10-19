// src/pages/ItineraryDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TripNavBar from '../components/TripNavBar'; 
// You can use the calendar component here if you want to display the first day immediately
import ItineraryDayCalendar from '../components/Itinerary'; 

function ItineraryDetail() {
  // Get the ID from the URL parameter defined in App.jsx
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        // You will need a backend endpoint like /api/itinerary/:id to fetch by ID
        const res = await axios.get(`http://localhost:6969/api/itinerary/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItinerary(res.data);
      } catch (err) {
        setError('Failed to load trip details. It may have been deleted or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItinerary();
    }
  }, [id, navigate]);

  if (loading) return <div className="loading">Loading Itinerary...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!itinerary) return <div className="error">Itinerary not found.</div>;

  // For simplicity, this displays the calendar for the first day,
  // but you could add tabs or a list to navigate all days here.
  const firstDay = itinerary.days[0];

  return (
    <>
      <TripNavBar destination={itinerary.destination} />
      <div className="itinerary-detail-container">
        <h1>Welcome to Your Trip to {itinerary.destination}!</h1>
        {firstDay ? (
            <ItineraryDayCalendar 
                activities={firstDay.activities} 
                dayNumber={firstDay.dayNumber} 
            />
        ) : (
            <p>This trip has no days planned yet.</p>
        )}
      </div>
    </>
  );
}

export default ItineraryDetail;