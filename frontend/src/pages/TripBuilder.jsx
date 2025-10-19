import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Link removed here
import axios from "axios";
import NavBar from "../components/NavBar";
import "./TripBuilder.css";

function TripBuilder() {
  const [formData, setFormData] = useState({
    destinationCity: "",
    destinationCountry: "",
    stayLength: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication failed. Please log in.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:6969/api/itinerary/generate",
        {
          destination: `${formData.destinationCity}, ${formData.destinationCountry}`,
          budget: Number(formData.budget),
          daysCount: Number(formData.stayLength),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdItinerary = res.data;
      console.log("Generated Itinerary:", createdItinerary);

      navigate(`/calendar`);
    } catch (err) {
      console.error("Error generating itinerary:", err);
      const errorMessage =
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : "Failed to generate itinerary. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

            {/* ✅ Corrected button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Generating..." : "Generate My Trip"}
            </button>

            {/* Optional: show errors */}
            {error && <p className="error-text">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default TripBuilder;
