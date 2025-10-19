import React from 'react';
import Home from './pages/Home';

import TripBuilder from "./pages/TripBuilder";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tripbuilder" element={<TripBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
