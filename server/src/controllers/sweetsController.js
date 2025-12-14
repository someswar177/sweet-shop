const Sweet = require('../models/Sweet');

exports.getSweets = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, available } = req.query; // Destructure
        let query = {};

        // Search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Price Filtering
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Availability Filter (If 'true', quantity must be > 0)
        if (available === 'true') {
            query.quantity = { $gt: 0 };
        }

        const sweets = await Sweet.find(query);
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

exports.purchaseSweet = async (req, res) => {
    try {
        const { id } = req.params;
        const sweet = await Sweet.findOneAndUpdate(
            { _id: id, quantity: { $gt: 0 } },
            { $inc: { quantity: -1 } },
            { new: true }
        );

        if (!sweet) {
            return res.status(400).json({ message: 'Sweet out of stock or not found' });
        }

        res.json({ message: 'Purchase successful', data: sweet });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// (Admin only):
exports.updateSweet = async (req, res) => {
    try {
        const { id } = req.params;
        const sweet = await Sweet.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }

        res.json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// (Admin only):
exports.deleteSweet = async (req, res) => {
    try {
        const { id } = req.params;
        const sweet = await Sweet.findByIdAndDelete(id);

        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }

        res.json({ message: 'Sweet removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};