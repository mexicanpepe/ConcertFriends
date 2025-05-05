// tests/auth.test.js
import request from 'supertest';
import app from '../app.js';
import admin from '../firebase-admin.js';

jest.mock('../firebase-admin.js');
const mockVerifyIdToken = jest.fn();

admin.auth = () => ({
  verifyIdToken: mockVerifyIdToken,
});

describe('POST /auth/firebase-login', () => {
  it('should create a new user if not found in DB', async () => {
    mockVerifyIdToken.mockResolvedValue({
      email: 'newuser@example.com',
      name: 'New User',
      picture: 'http://example.com/pic.jpg',
    });

    const res = await request(app)
      .post('/auth/firebase-login')
      .set('Authorization', 'Bearer mock-token');

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('newuser@example.com');
  });

  it('should fail if token is missing', async () => {
    mockVerifyIdToken.mockClear();
    const res = await request(app).post('/auth/firebase-login');
    expect(res.statusCode).toBe(401);
  });


  it('should fail with invalid token', async () => {
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));
    const res = await request(app)
      .post('/auth/firebase-login')
      .set('Authorization', 'Bearer bad-token');
    expect(res.statusCode).toBe(401);
  });
});
