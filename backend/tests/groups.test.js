// tests/groups.test.js
import request from 'supertest';
import app from '../app.js';
import admin from '../firebase-admin.js';

jest.mock('../firebase-admin.js');
const mockVerifyIdToken = jest.fn();

admin.auth = () => ({
  verifyIdToken: mockVerifyIdToken,
});

describe('POST /groups/create', () => {
  it('should reject creation with missing token', async () => {
    const res = await request(app).post('/groups/create');
    expect(res.statusCode).toBe(401);
  });

  it('should reject creation with missing params', async () => {
    mockVerifyIdToken.mockResolvedValue({ email: 'testuser@example.com' });

    const res = await request(app)
      .post('/groups/create')
      .set('Authorization', 'Bearer valid-token')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
