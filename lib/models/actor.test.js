const pool = require('../utils/pool');
const fs = require('fs');
const Actor = require('./actor');
const Movie = require('./movie');
describe('fresh-tomatoes-db routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('adds an actor', async() => {
    const newMovie = await Movie.insert({
      title: 'Step Brothers',
      year: 2008,
      director: 'Adam McKay',
      genre: 'Heartfelt Comedy',
      thumbs: true
    });
    const newActor = await Actor.insertActor({
      movieId: newMovie.id,
      name: 'Will Ferrell',
      oscar: true
    });

    const { rows } = await pool.query(`
    SELECT * FROM actors WHERE id=$1`,
    [newActor.id]);

    expect(newActor).toEqual(new Actor(rows[0]));
  });

  it('finds an actor by id', async() => {
    const stepBrothersMovie = await Movie.insert({
      title: 'Step Brothers',
      year: 2008,
      director: 'Adam McKay',
      genre: 'Heartfelt Comedy',
      thumbs: true
    });
    const createdActor = await Actor.insertActor({
      movieId: stepBrothersMovie.id,
      name: 'Will Ferrell',
      oscar: false
    });

    const foundActor = await Actor.findActorById(createdActor.id);

    expect(foundActor).toEqual(createdActor);
  });

  it('finds actor in a movie', async() => {
    const stepBrothersMovie = await Movie.insert({
      title: 'Step Brothers',
      year: 2008,
      director: 'Adam McKay',
      genre: 'Heartfelt Comedy',
      thumbs: true
    });
    const beeMovie = await Movie.insert({
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
    const actors = await Actor.findActorByMovieId(stepBrothersMovie.id);

    expect(actors).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        movieId: stepBrothersMovie.id,
        name: 'Will Ferrell',
        oscar: true
      },
      {
        id: expect.any(String),
        movieId: stepBrothersMovie.id,
        name: 'John C Reilly',
        oscar: true
      }
    ]));
  });

  it('finds all actors', async() => {
    const stepBrothersMovie = await Movie.insert({
      title: 'Step Brothers',
      year: 2008,
      director: 'Adam McKay',
      genre: 'Heartfelt Comedy',
      thumbs: true
    });
    const beeMovie = await Movie.insert({
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
      })
    ]);
    const actors = await Actor.findAllActors();

    expect(actors).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        movieId: stepBrothersMovie.id,
        name: 'Will Ferrell',
        oscar: true
      },
      {
        id: expect.any(String),
        movieId: stepBrothersMovie.id,
        name: 'John C Reilly',
        oscar: true
      },
      {
        id: expect.any(String),
        movieId: beeMovie.id,
        name: 'Jerry Seinfeld',
        oscar: false
      }
    ]));
  });

  it('updates an actor', async() => {
    const stepBrothersMovie = await Movie.insert({
      title: 'Step Brothers',
      year: 2008,
      director: 'Adam McKay',
      genre: 'Heartfelt Comedy',
      thumbs: true
    });
    const createdActor = await Actor.insertActor({
      movieId: stepBrothersMovie.id,
      name: 'Will Ferrell',
      oscar: false
    });

    const updatedActor = await Actor.updateActor(createdActor.id, {
      movieId: stepBrothersMovie.id,
      name: 'William Ferrell',
      oscar: true
    });

    const { rows } = await pool.query(`
    SELECT *
    FROM actors
    WHERE id = $1
    `, [updatedActor.id]);

    expect(rows[0]).toEqual({
      movie_id: stepBrothersMovie.id,
      name: 'William Ferrell',
      oscar: true,
      id: createdActor.id
    });
  });

  it('deletes an actor with the delete method', async() => {
    const stepBrothersMovie = await Movie.insert({
      title: 'Step Brothers',
      year: 2008,
      director: 'Adam McKay',
      genre: 'Heartfelt Comedy',
      thumbs: true
    });
    const createdActor = await Actor.insertActor({
      movieId: stepBrothersMovie.id,
      name: 'Will Ferrell',
      oscar: false
    });
    const createdActorTwo = await Actor.insertActor({
      movieId: stepBrothersMovie.id,
      name: 'John C Reilly',
      oscar: true
    });

    const deletedActor = await Actor.deleteActor(createdActor.id);
    expect(deletedActor).toEqual(createdActor);

    const foundActor = await Actor.findActorById(createdActor.id);
    expect(foundActor).toBeNull();

    const actors = await Actor.findAllActors();
    expect(actors).toEqual(expect.arrayContaining([createdActorTwo]));

  });

});
