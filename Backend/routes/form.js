const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tournament = require('../Models/Tournament');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST route to handle form submission
router.post('/post', upload.fields([{ name: 'poster' }, { name: 'ruleBook' }]), async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log form data
    console.log('Request Files:', req.files); // Log uploaded files

    // Validate if files are uploaded
    if (!req.files || !req.files['poster'] || !req.files['ruleBook']) {
      return res.status(400).json({ message: 'Please upload both poster and rule book files.' });
    }

    const { name, sport, totalTeams, teamSize, entryFee, endDate, location, prizeMoney } = req.body;

    // Get file paths
    const posterPath = req.files['poster'][0].path;
    const ruleBookPath = req.files['ruleBook'][0].path;

    // Create a new tournament document
    const tournament = new Tournament({
      name,
      sport,
      totalTeams,
      teamSize,
      entryFee,
      endDate,
      poster: posterPath,
      location,
      prizeMoney,
      ruleBook: ruleBookPath,
    });

    // Save the tournament to the database
    await tournament.save();

    res.json({ message: 'Tournament created successfully!', tournament });
  } catch (error) {
    console.error('Error saving tournament:', error);
    res.status(500).json({ message: 'Failed to create tournament' });
  }
});

// GET route to fetch all tournaments
router.get('/tournaments/', async (req, res) => {
    try {
      const tournaments = await Tournament.find();
      res.json(tournaments);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      res.status(500).json({ message: 'Failed to fetch tournaments' });
    }
  });

  router.get('/tournaments/:id', async (req, res) => {
    try {
      const tournament = await Tournament.findById(req.params.id); // Fetch a single tournament by ID
      if (!tournament) {
        return res.status(404).json({ message: 'Tournament not found' });
      }
      res.json(tournament);
    } catch (error) {
      console.error('Error fetching tournament:', error);
      res.status(500).json({ message: 'Failed to fetch tournament' });
    }
  });

module.exports = router;