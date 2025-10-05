/**
 * Chapter 3: API Tests (Hands-On 3.1)
 * - Should return an array of books
 * - Should return a single book
 * - Should return 400 if id is not a number
 */
const request = require('supertest');
const app = require('../src/app');

describe('Chapter 3: API Tests', () => {
  it('Should return an array of books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('title');
  });

  it('Should return a single book', async () => {
    const res = await request(app).get('/api/books/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title');
  });

  it('Should return a 400 error if the id is not a number', async () => {
    const res = await request(app).get('/api/books/abc');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'id must be a number' });
  });
});
