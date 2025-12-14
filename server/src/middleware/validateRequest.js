const { z } = require('zod');

const registerSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    role: z.enum(['user', 'admin']).optional()
});

exports.validateRegister = (req, res, next) => {
    try {
        registerSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ 
            message: 'Validation Error', 
            errors: error.errors 
        });
    }
};