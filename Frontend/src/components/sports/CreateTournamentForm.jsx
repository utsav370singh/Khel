import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const JAIPUR_CENTER = { lat: 26.9124, lng: 75.7873 };
const MAP_CONTAINER_STYLE = { width: "100%", height: "300px" };

const CreateTournamentForm = ({ showForm, setShowForm }) => {
  const { isLoaded: mapsLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    sport: "",
    totalTeams: "",
    teamSize: "",
    entryFee: "",
    endDate: "",
    poster: null,
    location: "",
    prizeMoney: "",
    ruleBook: null,
  });

  const [markerPosition, setMarkerPosition] = useState(JAIPUR_CENTER);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    setForm((prev) => ({
      ...prev,
      location: `${lat},${lng}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: Please log in.");
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token added here
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to create tournament.");
        return;
      }

      alert(result.message || "Tournament created successfully!");
      setShowForm(false);
      setStep(1);
    } catch (err) {
      alert("Submission failed.");
      console.error("Error submitting form:", err);
    }
  };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Fill All Details of The Tournament
        </h2>

        {step === 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 text-sm font-medium">Tournament Name</label>
              <input
                type="text"
                name="name"
                placeholder="Tournament Name"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Sport</label>
              <select
                name="sport"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Sport</option>
                <option value="Cricket">Cricket</option>
                <option value="Kabaddi">Kabaddi</option>
                <option value="Football">Football</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Total Teams</label>
              <input
                type="number"
                name="totalTeams"
                placeholder="Total Teams"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Team Size</label>
              <input
                type="number"
                name="teamSize"
                placeholder="Team Size"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Entry Fee Per Team</label>
              <input
                type="number"
                name="entryFee"
                placeholder="Entry Fee Per Team"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Tournament End Date</label>
              <input
                type="date"
                name="endDate"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Tournament Poster</label>
              <input
                type="file"
                name="poster"
                onChange={handleChange}
                accept="image/*"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Select Location</label>
              {mapsLoaded && (
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  zoom={15}
                  center={markerPosition}
                  onClick={handleMapClick}
                  onLoad={() => setMapLoaded(true)}
                >
                  {mapLoaded && <Marker position={markerPosition} />}
                </GoogleMap>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Prize Money</label>
              <input
                type="number"
                name="prizeMoney"
                placeholder="Prize Money"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Rule Book (PDF)</label>
              <input
                type="file"
                name="ruleBook"
                onChange={handleChange}
                accept=".pdf"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateTournamentForm;
