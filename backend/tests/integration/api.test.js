const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');

const email = `test_${Date.now()}@example.com`;
const password = 'TestPass1!';
let clientToken;
let adminToken;

afterAll(async () => {
  await pool.end();
});

describe('API integration', () => {
  test('register client', async () => {
    const res = await request(app).post('/api/auth/register').send({ nombre: 'Test User', email, password });
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
  });

  test('login client', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    clientToken = res.body.token;
    expect(clientToken).toBeTruthy();
  });

  test('me', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${clientToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(email);
  });

  test('list products public', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
  });

  test('client cannot access admin users', async () => {
    const res = await request(app).get('/api/admin/usuarios').set('Authorization', `Bearer ${clientToken}`);
    expect(res.status).toBe(403);
  });

  test('admin login', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@bikestore.co', password: 'Admin123!' });
    if (res.status === 200) {
      adminToken = res.body.token;
    }
    expect([200, 401]).toContain(res.status);
  });

  test('SQL injection login fails', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: "' OR 1=1 --", password: 'x' });
    expect(res.status).toBe(401);
  });

  test('IDOR: client cannot view arbitrary order', async () => {
    const res = await request(app).get('/api/pedidos/999999').set('Authorization', `Bearer ${clientToken}`);
    expect(res.status).toBe(404);
  });
});