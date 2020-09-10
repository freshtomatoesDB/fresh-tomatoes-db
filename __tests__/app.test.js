const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Movie = require('../lib/models/movie');
const Actor = require('../lib/models/actor');

describe('all routes', () => {

  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    const stepBrothersMovie = await Movie.insertMovie({
      title: 'Step Brothers',
      year: 2008,
      director: 'Adam McKay',
      genre: 'Heartfelt Comedy',
      thumbs: true
    });
    const beeMovie = await Movie.insertMovie({
      title: 'Bee Movie',
      year: 2007,
      director: 'Simon J. Smith',
      genre: 'animation',
      thumbs: true
    });
    await Promise.all([
      Actor.insertActor({
        movieId: stepBrothersMovie.id,
        name: 'Will Ferrell',
        oscar: true
      }),
      Actor.insertActor({
        movieId: stepBrothersMovie.id,
        name: 'John C Reilly',
        oscar: true
      }),
      Actor.insertActor({
        movieId: beeMovie.id,
        name: 'Jerry Seinfeld',
        oscar: false
      }),
    ]);
  
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

  it('gets all movies on GET', async() => {
    const response = await request(app)
      .get('/api/movies');

    expect(response.body).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        title: 'Step Brothers',
        year: 2008,
        director: 'Adam McKay',
        genre: 'Heartfelt Comedy',
        thumbs: true
      },
      {
        id: expect.any(String),
        title: 'Bee Movie',
        year: 2007,
        director: 'Simon J. Smith',
        genre: 'animation',
        thumbs: true
      }
    ]));
  });

  it('gets a movie by id', async() => {
    const stepBrothersMovie = await Movie.insertMovie({
      title: 'Step Brothers',
      year: 2008,
      director: 'Adam McKay',
      genre: 'Heartfelt Comedy',
      thumbs: true
    });

    const response = await request(app)
      .get(`/api/movies/${stepBrothersMovie.id}`);

    expect(response.body).toEqual(
      {
        id: expect.any(String),
        title: 'Step Brothers',
        year: 2008,
        director: 'Adam McKay',
        genre: 'Heartfelt Comedy',
        thumbs: true
      }
    );
  });

  it('returns null if passed a bad id', async() => {
    const response = await request(app)
      .get('/api/movies/1234');

    expect(response.body).toEqual({});
  });

  it('returns an updated movie after update', async() => {
    const moviesList = await Movie.findAllMovies();
    const savedMovieId = moviesList[0].id;
    const updatedMovie = {
      title: 'Step Brothers II',
      year: 2021,
      director: 'Michael Bay',
      genre: 'Lens Flare and explosions',
      thumbs: false
    };
    const response = await request(app)
      .put(`/api/movies/${savedMovieId}`)
      .send(updatedMovie);

    expect(response.body).toEqual({
      ...updatedMovie,
      id:savedMovieId
    });
  });
});
