const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  modelUrl: { type: String, required: true }, // URL to the 3D model (GLTF/GLB)
  color: { type: String, default: '#ffffff' }, // Base color
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
