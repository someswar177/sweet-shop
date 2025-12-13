const express = require('express');
const router = express.Router();
const { getSweets, createSweet } = require('../controllers/sweetsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSweets);
router.post('/', protect, admin, createSweet);

module.exports = router;