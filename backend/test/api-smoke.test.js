const request = require('supertest');
const app = require('../index'); // Your Express app entry point

describe('API Smoke Test', () => {
  it('GET /api/research-proposal-application/admin/get-all should return 200', async () => {
    const res = await request(app)
      .get('/api/research-proposal-application/admin/get-all')
      .set('Authorization', 'Bearer <YOUR_ADMIN_TOKEN>');
    expect(res.statusCode).toBe(200);
  });

  it('GET /api/research-investment-application/admin/get-all should return 200', async () => {
    const res = await request(app)
      .get('/api/research-investment-application/admin/get-all')
      .set('Authorization', 'Bearer <YOUR_ADMIN_TOKEN>');
    expect(res.statusCode).toBe(200);
  });

  it('GET /api/investor-application/admin/get-all should return 200', async () => {
    const res = await request(app)
      .get('/api/investor-application/admin/get-all')
      .set('Authorization', 'Bearer <YOUR_ADMIN_TOKEN>');
    expect(res.statusCode).toBe(200);
  });
});

// Add more tests for POST, PUT, DELETE as needed.
// Replace <YOUR_ADMIN_TOKEN> with a valid JWT for your app.
