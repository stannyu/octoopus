// POST api/returns {customerId, movieId}

/**
 * Return 401 if client is not logged in
 * Return 400 if customerId is not provided
 * Return 400 if movieId is not provided
 * Return 404 if no rental found for this customer and movie
 * Return 400 if rental already returned
 * Return 200 if this is valid request
 * Set return date
 * Calculate rental fee ---
 * Increase stock
 * Return the rental itself to client
 */

const mongoose = require('mongoose');
const request = require('supertest');
const { Rental } = require('../../models/rentals');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movies');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const executeReturnsTest = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customer: customerId, movie: movieId });
  };

  beforeEach(async () => {
    server = require('../../index');

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    genreId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: 'Tenet',
      dailyRentalRate: 2,
      genre: genreId,
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: customerId,
      movie: movieId,
      // As I just use id's to populate:
      //   customer: {
      //     _id: customerId,
      //     name: 'John Doe',
      //     phone: '555-555-555',
      //   },
      //   movie: {
      //     _id: movieId,
      //     title: 'Birdman',
      //     dailyRentalRate: 2,
      //   },
    });

    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  it('should return 401 if user is not logged in', async () => {
    // const res = await request(server).post('/api/returns').send({ customer: customerId, movie: movieId });

    token = '';
    const res = await executeReturnsTest();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customer id is not provided', async () => {
    // const token = new User().generateAuthToken();
    // const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ movie: movieId });
    customerId = null;
    const res = await executeReturnsTest();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movie id is not provided', async () => {
    // const token = new User().generateAuthToken();
    // const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ customer: customerId });
    movieId = null;
    const res = await executeReturnsTest();

    expect(res.status).toBe(400);
  });

  it('should return 404 if no rental found with customer/movie combination', async () => {
    await Rental.deleteMany({});
    const res = await executeReturnsTest();

    expect(res.status).toBe(404);
  });

  it('should return 400 movie was already returned by customer', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await executeReturnsTest();

    expect(res.status).toBe(404);
  });

  it('should return 200 request is valid', async () => {
    const res = await executeReturnsTest();

    expect(res.status).toBe(200);
  });

  it('should set the return date if input is valid', async () => {
    const res = await executeReturnsTest();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

    expect(rentalInDb.dateReturned).toBeDefined();
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should set the return date if input is valid', async () => {
    const res = await executeReturnsTest();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

    expect(rentalInDb.dateReturned).toBeDefined();
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should increase the movie number in stock', async () => {
    const res = await executeReturnsTest();
    const movieInDb = await Movie.findById(movieId);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return rental in the body of the response', async () => {
    const res = await executeReturnsTest();
    const rentalInDb = await Rental.findById(rental._id);

    expect(res.body).toHaveProperty('dateOut');
    expect(res.body).toHaveProperty('dateReturned');
    expect(res.body).toHaveProperty('customer');
    expect(res.body).toHaveProperty('movie');

    //or

    expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'customer', 'movie']));
  });
});
