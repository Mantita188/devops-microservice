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

describe('Endpoints de Productos (/products)', () => {
  it('GET /products debe retornar una lista con status 200', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /products debe registrar un nuevo producto con status 201', async () => {
    const newProduct = { name: 'Monitor 4K', price: 350 };
    const res = await request(app)
      .post('/products')
      .send(newProduct);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newProduct.name);
  });

  it('POST /products debe responder con error 400 si faltan campos', async () => {
    const res = await request(app)
      .post('/products')
      .send({});
    expect(res.statusCode).toEqual(400);
  });
});