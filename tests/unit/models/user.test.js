const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
  it('should return valid JWT', () => {
    const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true, name: 'John Doe' };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const result = jwt.verify(token, config.get('jwtPrivateKey'));

    expect(result).toMatchObject(payload);
  });
});
