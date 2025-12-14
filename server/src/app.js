const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const sweetsRoutes = require('./routes/sweetsRoutes');
const cors = require('cors');
const helmet = require('helmet');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors()); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));
}

module.exports = app;