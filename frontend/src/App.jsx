import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import TripBuilder from "./pages/TripBuilder";
import Itinerary from "./pages/Itinerary";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tripbuilder" element={<TripBuilder />} />
        <Route path="/itinerary/:tripId" element={<Itinerary />} />
      </Routes>
    </Router>
  );
}

export default App;
