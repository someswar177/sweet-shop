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

        it('should filter sweets by name', async () => {
            await request(app).post('/api/sweets').set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Gulab Jamun', category: 'Syrup', price: 20, quantity: 10 });

            await request(app).post('/api/sweets').set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Jalebi', category: 'Fried', price: 10, quantity: 10 });

            const res = await request(app).get('/api/sweets?search=Gulab');

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(1);
            expect(res.body[0].name).toEqual('Gulab Jamun');
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

    describe('PUT /api/sweets/:id', () => {
        let sweetId;

        beforeEach(async () => {
            const sweet = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Old Sweet', price: 10, category: 'Test', quantity: 5 });
            sweetId = sweet.body._id;
        });

        it('should allow admin to update a sweet', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Sweet', price: 15, quantity: 20 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual('Updated Sweet');
            expect(res.body.quantity).toEqual(20);
        });

        it('should prevent non-admins from updating', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ price: 100 });

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('DELETE /api/sweets/:id', () => {
        let sweetId;

        beforeEach(async () => {
            const sweet = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'To Delete', price: 10, category: 'Test', quantity: 5 });
            sweetId = sweet.body._id;
        });

        it('should allow admin to delete a sweet', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toMatch(/removed/i);
        });
    });

    describe('POST /api/sweets/:id/purchase', () => {
        let sweetId;

        beforeEach(async () => {
            const sweet = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Rasmalai', price: 50, category: 'Milk', quantity: 1 });
            sweetId = sweet.body._id;
        });

        it('should decrease quantity on successful purchase', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.quantity).toEqual(0);
        });

        it('should return 400 if out of stock', async () => {
            await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toMatch(/out of stock/i);
        });
    });
});