import React, { useState } from "react";
import "./Calendar.css";
import TripNavBar from "../components/TripNavBar"; // optional if you want the top nav
import PlanetDropdown from "../components/PlanetDropdown"; // your existing dropdown component

function Calendar() {
  const planets = [
    { name: "Mercury", color: "#a7a6a2" },
    { name: "Venus", color: "#d4af37" },
    { name: "Earth", color: "#2e8b57" },
    { name: "Mars", color: "#b22222" },
    { name: "Jupiter", color: "#e1b382" },
    { name: "Saturn", color: "#c2b280" },
    { name: "Neptune", color: "#4169e1" },
  ];

  const [openPlanet, setOpenPlanet] = useState(null);

  const handleToggle = (planet) => {
    setOpenPlanet(openPlanet === planet ? null : planet);
  };

  return (
    <>
      <TripNavBar />
      <div className="calendar-container">
        <h1 className="calendar-title">🪐 Your Cosmic Itinerary</h1>
        <div className="planet-row">
          {planets.map((planet) => (
            <div
              key={planet.name}
              className={`planet ${openPlanet === planet.name ? "active" : ""}`}
              style={{ backgroundColor: planet.color }}
              onClick={() => handleToggle(planet.name)}
            >
              <span className="planet-label">{planet.name}</span>
              {openPlanet === planet.name && (
                <PlanetDropdown planet={planet.name} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Calendar;
