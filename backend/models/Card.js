const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Jane Smith' },
  designation: { type: String, default: 'Software Engineer' },
  company: { type: String, default: 'Tech Corp' },
  tagline: { type: String, default: 'Turning ideas into immersive design' },
  location: { type: String, default: 'San Francisco, CA' },
  linkedin: { type: String, default: 'linkedin.com/in/janesmith' },
  twitter: { type: String, default: '@janesmith' },
  phone: { type: String, default: '+1 234 567 8900' },
  email: { type: String, default: 'jane@example.com' },
  website: { type: String, default: 'www.janesmith.com' },
  visibleFields: {
    type: Object,
    default: {
      name: true,
      designation: true,
      company: true,
      tagline: true,
      location: true,
      phone: true,
      email: true,
      website: true,
      linkedin: true,
      twitter: true
    }
  },
  color1: { type: String, default: '#3b82f6' },
  color2: { type: String, default: '#8b5cf6' },
  textColor: { type: String, default: '#ffffff' },
  style: { type: String, default: 'glass' },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
