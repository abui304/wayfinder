import React from "react";
import TripNavBar from "../components/TripNavBar";
import { useParams } from "react-router-dom";
import "./Itinerary.css";

function Itinerary() {
  const { tripId } = useParams();

  return (
    <>
      <TripNavBar />
      <div className="itinerary-container">
        <h1 className="itinerary-title">✨ Your Itinerary ✨</h1>
        <p className="itinerary-subtitle">
          Trip ID: <strong>{tripId}</strong>
        </p>

        <div className="itinerary-content">
          <p>
            Generated Trip Details.
          </p>
        </div>
      </div>
    </>
  );
}

export default Itinerary;
