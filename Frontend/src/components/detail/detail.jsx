import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

// Constants defined outside component
const LIBRARIES = ['places'];
const DEFAULT_CENTER = { lat: 26.9124, lng: 75.7873 }; // Default center coordinates

function TournamentDetails() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [error, setError] = useState(null);
  const [locationCoords, setLocationCoords] = useState(null);
  const [showFullscreenMap, setShowFullscreenMap] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/tournaments/${id}`);
        if (response.data) {
          setTournament(response.data);
          if (response.data.location) {
            const coords = parseCoordinates(response.data.location);
            if (coords) setLocationCoords(coords);
          }
        } else {
          setError('Tournament not found');
        }
      } catch (error) {
        console.error('Error fetching tournament details:', error);
        setError('Failed to fetch tournament details');
      }
    };

    fetchTournamentDetails();
  }, [id]);

  const parseCoordinates = (locationString) => {
    try {
      const [latStr, lngStr] = locationString.split(',');
      const lat = parseFloat(latStr.trim());
      const lng = parseFloat(lngStr.trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    } catch (e) {
      console.error('Error parsing coordinates:', e);
    }
    return null;
  };

  const toggleFullscreenMap = () => {
    setShowFullscreenMap(!showFullscreenMap);
  };

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500 text-xl">{error}</div>;
  }

  if (!tournament) {
    return <div className="flex items-center justify-center h-screen text-gray-600 text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Tournament Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {tournament.poster && (
                <img
                  src={`http://localhost:8080/${tournament.poster}`}
                  alt="Tournament Poster"
                  className="w-full md:w-80 h-64 object-cover rounded-lg shadow"
                />
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{tournament.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {tournament.sport}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Prize: ₹{tournament.prizeMoney}
                  </span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
                  JOIN TOURNAMENT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Details */}
          <div className="flex-1 space-y-6">
            {/* Tournament Details Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tournament Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm">Total Teams</div>
                    <div className="text-xl font-bold">{tournament.totalTeams}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm">Team Size</div>
                    <div className="text-xl font-bold">{tournament.teamSize}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm">Entry Fee</div>
                    <div className="text-xl font-bold">₹{tournament.entryFee}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm">End Date</div>
                    <div className="text-xl font-bold">
                      {new Date(tournament.endDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rule Book Card */}
            {tournament.ruleBook && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Rule Book
                  </h2>
                  <a
                    href={`http://localhost:8080/${tournament.ruleBook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Rule Book
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Map */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </h2>
                  <button
                    onClick={toggleFullscreenMap}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  >
                    View Full Map
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {loadError ? (
                  <div className="text-red-500 text-center py-8">Error loading map</div>
                ) : !isLoaded ? (
                  <div className="text-gray-600 text-center py-8">Loading map...</div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden h-64">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      zoom={locationCoords ? 15 : 10}
                      center={locationCoords || DEFAULT_CENTER}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false
                      }}
                    >
                      {locationCoords && <Marker position={locationCoords} />}
                    </GoogleMap>
                    {locationCoords && (
                      <p className="text-gray-500 text-sm text-center mt-2">
                        Coordinates: {locationCoords.lat.toFixed(4)}, {locationCoords.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Map Modal */}
      {showFullscreenMap && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full h-full max-w-6xl max-h-[90vh] relative">
            <button
              onClick={toggleFullscreenMap}
              className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 z-50"
              title="Close map"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                zoom={locationCoords ? 16 : 10}
                center={locationCoords || DEFAULT_CENTER}
              >
                {locationCoords && <Marker position={locationCoords} />}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                Loading map...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TournamentDetails;