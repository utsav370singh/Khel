const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  totalTeams: { type: Number, required: true },
  teamSize: { type: Number, required: true },
  entryFee: { type: Number, required: true },
  endDate: { type: Date, required: true },
  poster: { type: String }, // URL for the poster image
  location: { type: String, required: true }, // Format: "latitude,longitude"
  prizeMoney: { type: String }, // Prize money as a string (e.g., "10000 Rs")
  ruleBook: { type: String }, // URL for the rule book file
});

module.exports = mongoose.model('Tournament', tournamentSchema);