const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }
});

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                role: 'user'
            });

        if (res.statusCode !== 201) {
            console.error('Test Failed. Response Body:', res.body);
        }

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should return 400 if email already exists', async () => {
        // 1. Register a user
        await request(app).post('/api/auth/register').send({
            email: 'duplicate@test.com',
            password: 'password123',
            role: 'user'
        });

        // 2. Try to register SAME user again
        const res = await request(app).post('/api/auth/register').send({
            email: 'duplicate@test.com',
            password: 'password123',
            role: 'user'
        });

        // 3. Expect specific error message
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/already exists/i);
    });
});

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'login@example.com',
                password: 'password123',
                role: 'user'
            });
    });

    it('should login user and return JWT token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('message', 'Login successful');
    });

    it('should reject invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
    });
});