import React from "react";

function PlanetDropdown({ planet }) {
  return (
    <div className="planet-dropdown">
      <h3>{planet}</h3>
      <ul>
        <li>Sample activity 1</li>
        <li>Sample activity 2</li>
        <li>Sample activity 3</li>
      </ul>
    </div>
  );
}

export default PlanetDropdown;
