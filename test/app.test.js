const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('debe responder con estado 200 y status online', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'online');
  });
});
describe('GET /health', () => {
  it('debe responder con estado 200 y status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body).toHaveProperty('uptime');
  });
});