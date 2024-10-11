import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CricketPage from './pages/CricketPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={<LandingPage />} /> 
          <Route path="/LoginPage" element={<LoginPage />} /> 
          <Route path="/CricketPage" element={<CricketPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;

