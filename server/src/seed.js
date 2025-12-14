const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sweet = require('./models/Sweet');

dotenv.config();

const sweets = [
  { 
    name: 'Gulab Jamun', category: 'Syrup', price: 20, quantity: 50,
    image: '/images/gulab-jamun.jpg'
  },
  { 
    name: 'Kaju Katli', category: 'Nut', price: 40, quantity: 30,
    image: '/images/kaju-katli.jpg'
  },
  { 
    name: 'Rasgulla', category: 'Syrup', price: 15, quantity: 45,
    image: '/images/rasgulla.jpg'
  },
  { 
    name: 'Jalebi', category: 'Fried', price: 10, quantity: 20,
    image: '/images/jalebi.jpg'
  },
  { 
    name: 'Mysore Pak', category: 'Ghee', price: 30, quantity: 15,
    image: '/images/mysore-pak.jpg'
  },
  { 
    name: 'Ladoo', category: 'Ghee', price: 12, quantity: 60,
    image: '/images/ladoo.jpg'
  },
  { 
    name: 'Barfi', category: 'Milk', price: 25, quantity: 40,
    image: '/images/barfi.jpg'
  },
  { 
    name: 'Rasmalai', category: 'Milk', price: 50, quantity: 0,
    image: '/images/rasmalai.jpg'
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');
    await Sweet.deleteMany({});
    console.log('Cleared existing sweets');
    await Sweet.insertMany(sweets);
    console.log('Database Seeded with LOCAL assets');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();