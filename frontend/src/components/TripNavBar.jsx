import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // install: npm install react-icons
import "./TripNavBar.css";

function TripNavBar() {
  const [open, setOpen] = useState(false);

  // Mock list of trips — will later come from backend
  const trips = [
    { id: "tokyo", name: "Tokyo Adventure" },
    { id: "paris", name: "Paris Getaway" },
    { id: "cairo", name: "Cairo Expedition" },
  ];

  return (
    <nav className="trip-navbar">
      <div className="nav-left">
        <div className="dropdown">
          <button className="dropbtn" onClick={() => setOpen(!open)}>
            My Trips ▾
          </button>
          {open && (
            <div className="dropdown-content">
              {trips.map((trip) => (
                <Link
                  key={trip.id}
                  to={`/itinerary/${trip.id}`}
                  onClick={() => setOpen(false)}
                >
                  {trip.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="nav-right">
        <FaUserCircle className="profile-icon" />
      </div>
    </nav>
  );
}

export default TripNavBar;
