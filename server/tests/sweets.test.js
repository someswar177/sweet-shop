const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Sweet = require('../src/models/Sweet');

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGO_URI);
});
beforeEach(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Sweets API', () => {
    let userToken;
    let adminToken;

    beforeEach(async () => {
        await request(app).post('/api/auth/register').send({
            email: 'user@test.com', password: 'password123', role: 'user'
        });
        const userRes = await request(app).post('/api/auth/login').send({
            email: 'user@test.com', password: 'password123'
        });
        userToken = userRes.body.token;

        await request(app).post('/api/auth/register').send({
            email: 'admin@test.com', password: 'password123', role: 'admin'
        });
        const adminRes = await request(app).post('/api/auth/login').send({
            email: 'admin@test.com', password: 'password123'
        });
        adminToken = adminRes.body.token;
    });

    describe('GET /api/sweets', () => {
        it('should return empty array initially', async () => {
            const res = await request(app).get('/api/sweets');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
    });

    describe('POST /api/sweets', () => {
        it('should deny access without token (401)', async () => {
            const res = await request(app).post('/api/sweets').send({});
            expect(res.statusCode).toEqual(401);
        });

        it('should deny access for non-admin users (403)', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Ladoo', price: 10, category: 'Milk', quantity: 50 });
            
            expect(res.statusCode).toEqual(403);
        });

        it('should allow admin to create a sweet (201)', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Kaju Katli', price: 20, category: 'Nut', quantity: 100 });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('name', 'Kaju Katli');
        });
    });
});