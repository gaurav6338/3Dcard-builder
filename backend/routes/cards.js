const express = require('express');
const jwt = require('jsonwebtoken');
const Card = require('../models/Card');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

router.post('/', auth, async (req, res) => {
  try {
    let card = await Card.findOne({ userId: req.user.id });
    if (card) {
      card = await Card.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true });
    } else {
      card = new Card({ ...req.body, userId: req.user.id });
      await card.save();
    }
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User's Card
router.get('/me', auth, async (req, res) => {
  try {
    const card = await Card.findOne({ userId: req.user.id });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Public Card (for sharing)
router.get('/shared/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    // Increment analytics view count
    card.views += 1;
    await card.save();

    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
