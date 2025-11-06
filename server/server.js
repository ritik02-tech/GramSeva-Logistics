const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// YE 2 LINE SABSE UPAR DAAL DE (white page ka baap fix)
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => {
    console.log('MongoDB error:', err.message);
    process.exit(1);
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
  const parcel = new Parcel({
    trackingId: "GS" + Date.now(),
    ...req.body
  });
  await parcel.save();
  res.json(parcel);
});

app.get('/api/parcels', async (req, res) => {
  const parcels = await Parcel.find().sort({ createdAt: -1 });
  res.json(parcels);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`LIVE LINK: https://gramseva-live.onrender.com`);
});