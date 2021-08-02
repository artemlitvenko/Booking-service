const app = require('../app');
const config = require('../config');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');

describe('testing post endpoint of orders', () => {
    beforeAll(() => {
        mongoose.connect(config.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });
    const testData = {
        city: '6081358e2dd14410205faf0e',
        client_email: 'admin233333333d@example.com',
        client_name: 'Alena',
        end_time: '2021-06-15T06:00:00.000Z',
        master: '60b6e894f81ea34d48d47022',
        size: 7200000,
        start_time: '2021-06-15T04:00:00.000Z',
    };
    test('Create new order with correct date', async () => {
        const response = await request.post('/api/order').send(testData);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
    });
    test('Validation - incorrect email', async () => {
        const response = await request.post('/api/order').send({
            city: testData.city,
            client_email: 'admin233333333dexample.com',
            client_name: testData.client_name,
            end_time: testData.end_time,
            master: testData.master,
            size: testData.size,
            start_time: testData.start_time,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Incorrect request');
    });
    test('Validation - incorrect City Id', async () => {
        const response = await request.post('/api/order').send({
            city: '65465',
            client_email: testData.client_email,
            client_name: testData.client_name,
            end_time: testData.end_time,
            master: testData.master,
            size: testData.size,
            start_time: testData.start_time,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Incorrect request');
    });
    test('Validation - long name', async () => {
        const response = await request.post('/api/order').send({
            city: testData.city,
            client_email: testData.client_email,
            client_name: 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
            end_time: testData.end_time,
            master: testData.master,
            size: testData.size,
            start_time: testData.start_time,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Incorrect request');
    });
    test('Validation - incorrect end_time', async () => {
        const response = await request.post('/api/order').send({
            city: testData.city,
            client_email: testData.client_email,
            client_name: testData.client_name,
            end_time: 'dsasasd',
            master: testData.master,
            size: testData.size,
            start_time: testData.start_time,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Incorrect request');
    });
});
