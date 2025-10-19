import React from 'react';
import Home from './pages/Home';

import TripBuilder from "./pages/TripBuilder";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tripbuilder" element={<TripBuilder />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
