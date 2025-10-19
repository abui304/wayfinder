import React, { useState } from "react";
import NavBar from "../components/NavBar";
import "./TripBuilder.css";
import { useNavigate } from "react-router-dom";

function TripBuilder() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        destinationCity: "",
        destinationCountry:"",
        stayLength: "",
        budget: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 🔹 In the future, you’ll send this to the backend:
        // const res = await fetch("/api/trip", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(formData),
        // });
        // const data = await res.json();
        // navigate(`/itinerary/${data.tripId}`);

        // 🔹 Temporary fake trip ID until backend is ready:
        const tripId = crypto.randomUUID();

        console.log("Form submitted:", formData);
        navigate(`/itinerary/${tripId}`); // Redirect to itinerary page
    };
    // fetch("/api/trip", { method: "POST", body: JSON.stringify(formData) })
    /**
     * await fetch("http://localhost:5000/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        });
     */

    return (
    <>
      <TripNavBar />
      <div className="tripbuilder-container">
        <div className="form-card">
          <h1 className="form-title">Trip Builder</h1>
          <p className="form-subtitle">
            Enter your details to let Wayfinder chart your next journey.
          </p>

          <form className="trip-form" onSubmit={handleSubmit}>
            <label>Destination City</label>
            <input
              type="text"
              name="destinationCity"
              placeholder="e.g., Tokyo"
              value={formData.destinationCity}
              onChange={handleChange}
              required
            />

            <label>Destination Country</label>
            <input
              type="text"
              name="destinationCountry"
              placeholder="e.g., Japan"
              value={formData.destinationCountry}
              onChange={handleChange}
              required
            />

            <label>Length of Stay (days)</label>
            <input
              type="number"
              name="stayLength"
              placeholder="e.g., 7"
              value={formData.stayLength}
              onChange={handleChange}
              required
            />

            <label>Total Budget (USD)</label>
            <input
              type="number"
              name="budget"
              placeholder="e.g., 1500"
              value={formData.budget}
              onChange={handleChange}
              required
            />

            <button type="submit" className="submit-btn">
              Generate My Trip
            </button>
          </form>
        </div>
      </div>
    </>
    );
}

export default TripBuilder;
