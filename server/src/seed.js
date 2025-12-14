const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sweet = require('./models/Sweet');

dotenv.config();

const sweets = [
  { name: 'Gulab Jamun', category: 'Syrup', price: 20, quantity: 5 },
  { name: 'Kaju Katli', category: 'Nut', price: 40, quantity: 0 },
  { name: 'Rasgulla', category: 'Syrup', price: 15, quantity: 45 },
  { name: 'Jalebi', category: 'Fried', price: 10, quantity: 20 },
  { name: 'Mysore Pak', category: 'Ghee', price: 30, quantity: 15 },
  { name: 'Ladoo', category: 'Ghee', price: 12, quantity: 60 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connected to DB...');

    await Sweet.deleteMany({});
    console.log('🧹 Cleared existing sweets');

    await Sweet.insertMany(sweets);
    console.log('🍬 Added dummy sweets');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();