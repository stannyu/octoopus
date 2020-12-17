const mongoose = require('mongoose');
const { User } = require('../../../models/user');
const { auth } = require('../../../middleware/auth');
const users = require('../../../routes/users');

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = { _id: mongoose.Types.ObjectId().toHexString(), name: 'John', isAdmin: true };
    const token = new User(user).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
