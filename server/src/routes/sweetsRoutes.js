const express = require('express');
const router = express.Router();
const { getSweets, createSweet, purchaseSweet } = require('../controllers/sweetsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSweets);
router.post('/', protect, admin, createSweet);
router.post('/:id/purchase', protect, purchaseSweet);

module.exports = router;