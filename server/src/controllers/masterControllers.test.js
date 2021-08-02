const app = require('../app');
const config = require('../config');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');

describe('testing endpoint of masters', () => {
    beforeAll(() => {
        mongoose.connect(config.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });
    const testData = { city: '6081470183fde44a4010eb19', name: 'Artem', rating: 5 };

    describe('Post', function () {
        test('Create new master with correct date', async () => {
            const response = await request.post('/api/master').send({ name: testData.name, rating: testData.rating, city: testData.city });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.any(Object));
        });
        test('Validation - empty name', async () => {
            const response = await request.post('/api/master').send({ name: '', rating: testData.rating, city: testData.city });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
        test('Validation - long name', async () => {
            const response = await request
                .post('/api/master')
                .send({ name: 'ddddddddddddddddddddddddddddddddddddddddddddddddddd', rating: testData.rating, city: testData.city });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
        test('Validation - short name', async () => {
            const response = await request.post('/api/master').send({ name: 'dd', rating: testData.rating, city: testData.city });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
        test('Validation - empty rating', async () => {
            const response = await request.post('/api/master').send({ name: testData.name, rating: '', city: testData.city });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
        test('Validation - rating too big', async () => {
            const response = await request.post('/api/master').send({ name: testData.name, rating: 10, city: testData.city });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
        test('Validation - empty city', async () => {
            const response = await request.post('/api/master').send({ name: testData.name, rating: testData.rating, city: '' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
        test('Validation - id of city is incorrect', async () => {
            const response = await request.post('/api/master').send({ name: testData.name, rating: testData.rating, city: 'asadsadsd' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
    });

    describe('Get', function () {
        test('get masters', async () => {
            const response = await request.get('/api/master');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.any(Object));
        });
    });

    describe('Put', function () {
        test('Update master with correct date', async () => {
            const req = { body: { name: testData.name, city: testData.city, rating: testData.rating } };
            const id = '60b65a2f6b4b013b0cf92d83';
            const response = await request.put(`/api/master/${id}`, req);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.any(Object));
        });
        test('Validation - incorrect User Id', async () => {
            const req = { body: { name: testData.name, city: testData.city, rating: testData.rating } };
            const id = 'sadssds';
            const response = await request.put(`/api/master/${id}`, req);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
        test('Validation - short name', async () => {
            const req = { body: { name: 'Ar', city: testData.city, rating: testData.rating } };
            const id = '60b65a2f6b4b013b0cf92d83';
            const response = await request.put(`/api/master/${id}`, req);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
        test('Validation - id of city is incorrect', async () => {
            const req = { body: { name: testData.name, city: '54', rating: testData.rating } };
            const id = '60b65a2f6b4b013b0cf92d83';
            const response = await request.put(`/api/master/${id}`, req);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
    });

    describe('Delete', function () {
        test('do not delete master with incorrect ID', async () => {
            const req = { params: { id: 'ghdhjdjdhg' } };
            const id = req.params.id;
            const response = await request.delete(`/api/master/${id}`);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Incorrect request');
        });
        test('delete master with correct ID', async () => {
            const id = '60b65a2f6b4b013b0cf92d83';
            const response = await request.delete(`/api/master/${id}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.any(Object));
        });
    });
});
