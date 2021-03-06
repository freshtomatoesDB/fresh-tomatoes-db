const pool = require('../utils/pool');
const fs = require('fs');
const Movie = require('./movie');
const Actor = require('./actor');

describe('Movie class', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a movie into the database', async() => {
    const createdMovie = await Movie.insertMovie({
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
    const beeMovie = await Movie.insertMovie({
      title: 'Bee Movie',
      year: 2007,
      director: 'Simon J. Smith',
      genre: 'animation',
      thumbs: true
    });

    const foundBeeMovie = await Movie.findMovieById(beeMovie.id);

    expect(foundBeeMovie).toEqual(beeMovie);
  });

  it('returns null if movie does not exist', async() => {
    const foundNoMovie = await Movie.findMovieById('1234');

    expect(foundNoMovie).toBeNull();
  });

  it('finds all movies', async() => {
    await Promise.all([
      Movie.insertMovie({
        title: 'Bee Movie',
        year: 2007,
        director: 'Simon J. Smith',
        genre: 'animation',
        thumbs: true
      }),
      Movie.insertMovie({
        title: 'Step Brothers',
        year: 2008,
        director: 'Adam McKay',
        genre: 'comedy',
        thumbs: true
      }),
      Movie.insertMovie({
        title: 'Bee Movie 2',
        year: 2021,
        director: 'Simon J. Smith',
        genre: 'animation',
        thumbs: true
      })
    ]);
    const movies = await Movie.findAllMovies();

    expect(movies).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        title: 'Bee Movie',
        year: 2007,
        director: 'Simon J. Smith',
        genre: 'animation',
        thumbs: true
      },
      {
        id: expect.any(String),
        title: 'Step Brothers',
        year: 2008,
        director: 'Adam McKay',
        genre: 'comedy',
        thumbs: true
      },
      {
        id: expect.any(String),
        title: 'Bee Movie 2',
        year: 2021,
        director: 'Simon J. Smith',
        genre: 'animation',
        thumbs: true
      }
    ]));
  });

  it('finds movie by id and all actors in it', async() => {
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
    const stepBrothersWithActors = await Movie.findActorsByMovieId(stepBrothersMovie.id);

    expect(stepBrothersWithActors).toEqual({
      ...stepBrothersMovie,
      actors: expect.arrayContaining([
        {
          id: expect.any(Number),
          movieId: Number(stepBrothersMovie.id),
          name: 'Will Ferrell',
          oscar: true
        },
        {
          id: expect.any(Number),
          movieId: Number(stepBrothersMovie.id),
          name: 'John C Reilly',
          oscar: true
        }
      ])
    });
  });

  it('updates a movie by id', async() => {
    const beeMovie = await Movie.insertMovie({
      title: 'Bee Movie',
      year: 2007,
      director: 'Simon J. Smith',
      genre: 'animation',
      thumbs: true
    });

    const coolerBeeMovie = await Movie.updateMovie(beeMovie.id, {
      title: 'Bee Movie: Bigger Badder Better',
      year: 2007,
      director: 'Simon J. Smith',
      genre: 'live action',
      thumbs: false
    });

    expect(coolerBeeMovie).toEqual({
      id: coolerBeeMovie.id,
      ...coolerBeeMovie
    });
  });

  it('deletes movie by id', async() => {
    const createdMovie = await Movie.insertMovie({
      title: 'Bee Movie',
      year: 2007,
      director: 'Simon J. Smith',
      genre: 'animation',
      thumbs: true
    });

    const deletedMovie = await Movie.delete(createdMovie.id);

    expect(deletedMovie).toEqual({
      id: createdMovie.id,
      ...createdMovie
    });
  });


});
