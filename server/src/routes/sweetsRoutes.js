const express = require('express');
const router = express.Router();
const { getSweets, createSweet, purchaseSweet, updateSweet, deleteSweet } = require('../controllers/sweetsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSweets);
router.post('/', protect, admin, createSweet);
router.post('/:id/purchase', protect, purchaseSweet);
router.put('/:id', protect, admin, updateSweet);
router.delete('/:id', protect, admin, deleteSweet);

module.exports = router;