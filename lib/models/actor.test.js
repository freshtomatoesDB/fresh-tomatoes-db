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
    const newActor = await Actor.insert({
      movieId: newMovie.id,
      name:'Will Ferrell',
      oscar: true
    });

    const { rows }  = await pool.query(`
    SELECT * FROM actors WHERE id=$1`, 
    [newActor.id]);

    expect(newActor).toEqual(new Actor(rows[0]));
  });
  it('')
});
