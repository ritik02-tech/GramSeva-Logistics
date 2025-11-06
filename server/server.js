const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (frontend) → WHITE PAGE FIX
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully! 🎉'))
  .catch(err => {
    console.log('MongoDB connection error:', err.message);
    process.exit(1); // Server band ho jayega agar MongoDB nahi chala
  });

// Parcel Schema
const parcelSchema = new mongoose.Schema({
  trackingId: String,
  sender: String,
  receiver: String,
  pickup: String,
  drop: String,
  status: { type: String, default: "Booked" }
}, { timestamps: true });

const Parcel = mongoose.model('Parcel', parcelSchema);

// APIs
app.post('/api/parcel', async (req, res) => {
  try {
    const parcel = new Parcel({
      trackingId: "GS" + Date.now(),
      ...req.body
    });
    await parcel.save();
    res.json(parcel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/parcels', async (req, res) => {
  try {
    const parcels = await Parcel.find().sort({ createdAt: -1 });
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch all routes → index.html (SPA fix)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Port binding → Render ke liye PERFECT
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GramSeva Logistics is LIVE! 🚀`);
  console.log(`Visit: https://gramseva-live.onrender.com`);
});