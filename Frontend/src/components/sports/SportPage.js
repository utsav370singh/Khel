import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLoadScript } from '@react-google-maps/api';
import TournamentCard from './TournamentCard';

const LIBRARIES = ['places'];

function SportPage({ sport }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { isLoaded: mapsLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:8080/api/v1/tournaments');

        const filteredTournaments =
          sport.toLowerCase() === 'all'
            ? data
            : data.filter((t) => t.sport.toLowerCase() === sport.toLowerCase());

        setTournaments(filteredTournaments);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${sport} tournaments:`, err);
        setError('Failed to load tournaments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [sport]);

  const handleCardClick = (id) => {
    navigate(`/tournament/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-10 px-4 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {sport} tournaments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-10 px-4 flex justify-center items-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      {sport.toLowerCase() !== 'all' && (
        <h1 className="text-3xl font-bold text-center mb-10 capitalize">{sport} Tournaments</h1>
      )}

      {loadError && (
        <div className="text-red-500 text-center py-8">
          Error loading maps. Some location features may not work.
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TournamentCard
              key={tournament._id}
              tournament={tournament}
              mapsLoaded={mapsLoaded}
              onCardClick={handleCardClick}
            />
          ))
        ) : (
          <div className="text-center py-8 w-full">
            <p className="text-gray-500 text-lg">
              No {sport} tournaments available right now. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SportPage;
