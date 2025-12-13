const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 }
});

sweetSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Sweet', sweetSchema);