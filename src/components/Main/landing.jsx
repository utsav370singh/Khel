import React, { useState } from "react";
import "./landing.css"; 

const Landing = () => {
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
    <>
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              Fill All Details of The Tournament
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Form fields */}
              <div className="form-group">
                <label className="form-label">Tournament Name:</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter Tournament Name"
                  value={newTournament.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Sport:</label>
                <select
                  name="sport"
                  className="form-input"
                  value={newTournament.sport}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Sport</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                </select>
              </div>

              <div className="form-group-row">
                <div>
                  <label className="form-label">Total Teams:</label>
                  <input
                    type="number"
                    name="totalTeams"
                    className="form-input"
                    placeholder="Total Teams"
                    value={newTournament.totalTeams}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Team Size:</label>
                  <input
                    type="number"
                    name="teamSize"
                    className="form-input"
                    placeholder="Team Size"
                    value={newTournament.teamSize}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Entry Fee Per Team (Rs):</label>
                <input type="number" name="entryFee" className="form-input" placeholder="Enter Entry Fee" value={newTournament.entryFee} onChange={handleInputChange} required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration End Date:</label>
                <input
                  type="date"
                  name="registrationEndDate"
                  className="form-input"
                  value={newTournament.registrationEndDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* File Input for Photo */}
              <div className="form-group">
                <label className="form-label">Tournament Photo:</label>
                <input
                  type="file"
                  name="photo"
                  className="form-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of Tournaments as Cards */}
      {/* <div className="tournament-list">
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
        )} */}
      {/* </div> */}
    </>
  );
};

export default Landing;
