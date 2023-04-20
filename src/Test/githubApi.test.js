const request = require('supertest');
const app = require('../MockServer/mockServer');

describe('GitHub User API tests', () => {
  test('Green test: Should return a list of users', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);

    const user1 = response.body.find((user) => user.login === 'github_user1');
    expect(user1.id).toBe(1);
    expect(user1.plan.name).toBe('free');

    const user2 = response.body.find((user) => user.login === 'github_user2');
    expect(user2.id).toBe(2);
    expect(user2.plan.name).toBe('pro');
  });

  test('Green test: Should return user1 data', async () => {
    const response = await request(app).get('/users/user1');
    expect(response.statusCode).toBe(200);
    expect(response.body.login).toBe('user1');
    expect(response.body.id).toBe(1);
    expect(response.body.plan.name).toBe('free');
  });

  test('Green test: Should update the authenticated user plan', async () => {
    const response = await request(app)
      .patch('/user')
      .send({ plan: { name: 'updated_premium' } });
    expect(response.statusCode).toBe(200);
    expect(response.body.login).toBe('authenticated_user');
    expect(response.body.id).toBe(100);
    expect(response.body.plan.name).toBe('updated_premium');
  });

  test('Green test: Should return the authenticated user data', async () => {
    const response = await request(app).get('/user');
    expect(response.statusCode).toBe(200);
    expect(response.body.login).toBe('authenticated_user');
    expect(response.body.id).toBe(100);
    expect(response.body.plan.name).toBe('updated_premium');
  });

  test('Error test: Should return 405 for an unsupported route', async () => {
    const response = await request(app).get('/unsupported');
    expect(response.statusCode).toBe(405);
  });

  test('Error test: Should return a 400 for invalid PATCH request', async () => {
    const response = await request(app)
      .patch('/user')
      .send({ plan: { name: 123 } });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid request body');
  });

  test('Error test: Should return 405 for an unsupported route on the /user endpoint', async () => {
    const response = await request(app).get('/user/unsupported');
    expect(response.statusCode).toBe(405);
  });

  test('Edge-case test: Should handle unsupported HTTP methods', async () => {
    const response = await request(app).post('/users');
    expect(response.statusCode).toBe(405);
  });

  test('Edge-case test: Should handle empty request body for PATCH request', async () => {
    const response = await request(app).patch('/user').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid request body');
  });

  test('Edge-case test: Should handle unsupported HTTP methods on the /user endpoint', async () => {
    const response = await request(app).post('/user');
    expect(response.statusCode).toBe(405);
  });

  test('Edge-case test: Should handle special characters in the username', async () => {
    const response = await request(app).get('/users/user!@#$%^&*()');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});
