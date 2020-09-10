const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');

describe('all routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('makes a new movie on POST', async() => {
    const response = await request(app)
      .post('/api/movies')
      .send({
        title: 'Bee Movie',
        year: 2007,
        director: 'Simon J. Smith',
        genre: 'animation',
        thumbs: true
      });

    expect(response.body).toEqual({
      id: expect.any(String),
      title: 'Bee Movie',
      year: 2007,
      director: 'Simon J. Smith',
      genre: 'animation',
      thumbs: true
    });
  });
});
