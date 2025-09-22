import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Main from './components/sports/main';
import Login from './components/login/login';
import Cricket from './components/sports/cricket';
import Football from './components/sports/football';
import Kabaddi from './components/sports/kabaddi';
import TournamentDetails from './components/detail/detail';
import OrganizerDashboard from './components/dashboard/OrganizerDashboard';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Main  />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/tournament/:id" element={<TournamentDetails />} />
          <Route path="/cricket" element={<Cricket />} />
          <Route path="/football" element={<Football />} />
          <Route path="/kabaddi" element={<Kabaddi />} />
          <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <OrganizerDashboard />
    </ProtectedRoute>
  }
/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
