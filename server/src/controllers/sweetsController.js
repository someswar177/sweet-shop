const Sweet = require('../models/Sweet');

exports.getSweets = async (req, res) => {
    try {
        const sweets = await Sweet.find({});
        res.json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createSweet = async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;
        const sweet = new Sweet({ name, category, price, quantity });
        const createdSweet = await sweet.save();
        res.status(201).json(createdSweet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};