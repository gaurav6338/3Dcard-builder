const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://gaurav:gaurav123@cluster0.9jh4vwv.mongodb.net/visiting_card_db';

const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards');

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    console.log('App will run without database connection. API will return mock data if DB fails.');
  });

app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);

// Mock data fallback if no DB (For backward compatibility during development)
const mockProducts = [
  {
    _id: "1",
    name: "Modern Chair",
    description: "A sleek, ergonomic modern chair perfect for your home office.",
    price: 299.99,
    modelUrl: "chair",
    color: "#ff5555"
  }
];

// Fallback old API Routes
app.get('/api/products', async (req, res) => {
  res.json(mockProducts);
});

app.get('/api/products/:id', async (req, res) => {
  res.json(mockProducts[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
