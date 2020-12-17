const request = require('supertest');
const { Genre } = require('../../models/genres');
const { User } = require('../../models/user');

let server;

describe('auth middleware', () => {
  let token;
  beforeEach(() => {
    server = require('../../index');
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
  });

  const executeAuthMiddleware = async () => {
    return await request(server).post('/api/genres').set('x-auth-token', token).send({ name: 'genre1' });
  };

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await executeAuthMiddleware();
    
    expect(res.status).toBe(401);
  });

    it('should return 400 if token is invalid', async () => {
      token = 'invalid_token';
      const res = await executeAuthMiddleware();

      expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
      const res = await executeAuthMiddleware();
      expect(res.status).toBe(200);
    });
});
