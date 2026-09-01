const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('debe responder con estado 200 y status online', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'online');
  });
});