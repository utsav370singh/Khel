const express = require('express');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads
const path = require('path');
const connectDB = require('./Conn/conn');
const form = require('./routes/form');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique filenames
  },
});

const upload = multer({ storage });

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1', form);
app.use('/api/v1/auth', authRoutes);

// Example route for handling file uploads
app.post('/api/v1/post', upload.single('poster'), (req, res) => {
  try {
    const { name, sport, totalTeams, teamSize, entryFee, endDate, location, prizeMoney } = req.body;
    const poster = req.file ? req.file.filename : null; // Save the filename of the uploaded file

    // Save tournament data to the database, including the poster filename
    // Example: await Tournament.create({ name, sport, totalTeams, teamSize, entryFee, endDate, location, prizeMoney, poster });

    res.status(201).json({ message: 'Tournament created successfully!', poster });
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ message: 'Failed to create tournament' });
  }
});

// Start server
app.listen(8080, () => console.log('Server running on port 8080'));