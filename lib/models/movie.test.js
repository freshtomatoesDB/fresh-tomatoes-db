const pool = require('../utils/pool');
const fs = require('fs');
const Movie = require('./movie');

describe('Movie class', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a movie into the database', async() => {
    const createdMovie = await Movie.insert({
      title: 'Bee Movie',
      year: 2007,
      director: 'Simon J. Smith',
      genre: 'animation',
      thumbs: true
    });

    const { rows } = await pool.query(`
    SELECT * FROM movies 
    WHERE id = $1
    `, [createdMovie.id]);

    expect(rows[0]).toEqual(createdMovie);
  });

  it('finds a movie by id', async() => {
    const beeMovie = await Movie.insert({
      title: 'Bee Movie',
      year: 2007,
      director: 'Simon J. Smith',
      genre: 'animation',
      thumbs: true
    });

    const foundBeeMovie = await Movie.findById(beeMovie.id);

    expect(foundBeeMovie).toEqual(beeMovie);
  });

  it('returns null if movie does not exist', async() => {
    const foundNoMovie = await Movie.findById('1234');

    expect(foundNoMovie).toBeNull();
  });
});