import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const JAIPUR_CENTER = { lat: 26.9124, lng: 75.7873 };
const FULLSCREEN_MAP_STYLE = { width: "100%", height: "100%" };

const TournamentCard = ({ tournament, mapsLoaded }) => {
  const navigate = useNavigate();
  const [showFullscreenMap, setShowFullscreenMap] = useState(false);
  const [, setLocationName] = useState("Detecting location...");
  const [mapLoaded, setMapLoaded] = useState(false);

  const isValidLocation = useMemo(() => (
    tournament.location &&
    typeof tournament.location === "string" &&
    tournament.location.includes(",")
  ), [tournament.location]);

  const locationCoords = useMemo(() => {
    if (isValidLocation) {
      const [latStr, lngStr] = tournament.location.split(",");
      return {
        lat: parseFloat(latStr),
        lng: parseFloat(lngStr),
      };
    }
    return JAIPUR_CENTER;
  }, [tournament.location, isValidLocation]);

  const getLocationName = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      return response.data.results[0]?.formatted_address || "Location not specified";
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Could not detect location";
    }
  };

  useEffect(() => {
    if (locationCoords) {
      getLocationName(locationCoords.lat, locationCoords.lng)
        .then(setLocationName)
        .catch(() => setLocationName("Error detecting location"));
    }
  }, [locationCoords]);

  const handleCardClick = () => {
    navigate(`/tournament/${tournament._id}`);
  };

  const toggleFullscreenMap = (e) => {
    e.stopPropagation(); // Prevent the card click event from firing
    setShowFullscreenMap(!showFullscreenMap);
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div 
      className="relative bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-sm transition-all duration-300 hover:shadow-xl cursor-pointer"
      onClick={handleCardClick}
    >
      {tournament.poster && (
        <div className="w-full h-64 overflow-hidden">
          <img
            src={`http://localhost:8080/${tournament.poster}`}
            alt="Tournament Poster"
            className="w-full h-full object-cover object-center"
            loading="lazy"
            onError={(e) => {
              e.target.src = './images/logo.jpg';
            }}
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-gray-800 line-clamp-2" style={{ minHeight: '3rem' }}>
            {tournament.name}
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap">
            {tournament.sport}
          </span>
        </div>
        
        <div className="space-y-2 text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Entry Fee:</span>
            <span>{tournament.entryFee || 'Free'} Rs.</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">End Date:</span>
            <span>{new Date(tournament.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Prize Money:</span>
            <span className="text-green-600 font-semibold">{tournament.prizeMoney} Rs.</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            {/* <span className="font-medium">Location:</span> */}
            <button 
              onClick={toggleFullscreenMap}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              Location
              <svg 
                className="w-4 h-4 ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {/* <p className="text-sm text-gray-500 mt-1 truncate">{locationName}</p> */}
        </div>
      </div>

      {showFullscreenMap && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full h-full max-w-6xl max-h-[90vh] relative">
            <button
              onClick={toggleFullscreenMap}
              className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 z-50"
              title="Close map"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {mapsLoaded ? (
              <GoogleMap
                mapContainerStyle={FULLSCREEN_MAP_STYLE}
                zoom={16}
                center={locationCoords}
                onLoad={handleMapLoad}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
              >
                {mapLoaded && <Marker position={locationCoords} />}
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
};

export default TournamentCard;