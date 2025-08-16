const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');

let token;
let bookId;

beforeAll(async () => {
  // Connect to in-memory MongoDB server or test database
  await mongoose.connect(process.env.MONGO_URI);

  // Create a test user and get JWT
  const user = new User({ username: 'testuser', password: await require('bcryptjs').hash('pass1234', 10) });
  await user.save();
  token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);

  // Add a book
  const book = new Book({ title: 'Test Book', author: 'Tester', ISBN: '1111111111', user: user._id });
  await book.save();
  bookId = book._id;
});

afterAll(async () => {
  await Book.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('GET /api/books', () => {
  it('should return all books with valid token', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.books).toBeInstanceOf(Array);
    expect(res.body.books.length).toBeGreaterThan(0);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(401);
  });
});