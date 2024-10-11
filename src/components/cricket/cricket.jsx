import React, { useState } from "react";
import './cricket.css';

const Cricket = () => {

    const [showModal, setShowModal] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({
    name: "",
    sport: "",
    totalTeams: "",
    teamSize: "",
    entryFee: "",
    registrationEndDate: "",
    photo: null, // To store the uploaded image
  });

  // Handle input changes
  const handleInputChange = (e) => {
    setNewTournament({ ...newTournament, [e.target.name]: e.target.value });
  };

  // Handle file (image) input change
  const handleFileChange = (e) => {
    setNewTournament({ ...newTournament, photo: URL.createObjectURL(e.target.files[0]) });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setTournaments([...tournaments, { ...newTournament, id: tournaments.length + 1 }]);
    setShowModal(false); // Close modal on form submission
    setNewTournament({
      name: "",
      sport: "",
      totalTeams: "",
      teamSize: "",
      entryFee: "",
      registrationEndDate: "",
      photo: null, 
    });
  };


  return (
    <div>
      {/* List of Tournaments as Cards */}
      <div className="tournament-list">
        <h2>Upcoming Tournaments</h2>
        {tournaments.length > 0 ? (
          <div className="tournament-cards">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="card">
                <div className="card-body">
                  <div className="card-info">
                    <h3>{tournament.name}</h3>
                    <p>Sports: {tournament.sport}</p>
                    <p>Date: {tournament.registrationEndDate}</p>
                    <p>Location: Central Park</p>
                    <p>Registration Fee: {tournament.entryFee}</p>
                  </div>
                  <div className="card-image-container">
                    <img src={tournament.photo} alt={tournament.name} className="card-image"/>
                  </div>
                </div>
                <div className="card-footer">
                  <p>Registration Ends: {tournament.registrationEndDate}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tournaments available. Add some!</p>
        )}
      </div>
    </div>
  );
}

export default Cricket;