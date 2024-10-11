import React, { useState } from "react";
import './navbar.css'; 

const Navbar = () => {

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
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/"><img src="./images/logo.jpg" alt="Sports Korner" className="navbar-logo"/></a>
      </div>
      <div className="navbar-right">
        <ul className="navbar-links">
          <li><a href="CricketPage">CRICKET</a></li>
          <li><a href="#basketball">BASKETBALL</a></li>
          <li><a href="#kabaddi">KABADDI</a></li>
        </ul>
        
      </div>
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
                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>
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
      <button className="open-button" onClick={() => setShowModal(true)}>
        Create Tournament 
      </button>
      <a href="LoginPage">Login/Sign Up</a>
    </nav>
  );
};

export default Navbar;
