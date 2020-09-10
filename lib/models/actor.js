const pool = require('../utils/pool');

class Actor {
  id;
  movieId;
  name;
  oscar;

  constructor(row) {
    this.id = row.id;
    this.movieId = row.movie_id;
    this.name = row.name;
    this.oscar = row.oscar;
  }

  static async insert(actor) {
    const { rows } = await pool.query(`
    INSERT INTO actors(movie_id, name, oscar)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [actor.movieId, actor.name, actor.oscar]);
    return new Actor(rows[0]);
  }

  static async findActorById(actorId) {
    const { rows } = await pool.query(`
      SELECT * FROM actors
      WHERE id = $1
    `, [actorId]);

    if(!rows[0]) return null;
    else return new Actor(rows[0]);
  }

  static async findByMovieId(movieId) {
    const { rows } = await pool.query(`
    SELECT *
    FROM actors
    WHERE movie_id=$1`,
    [movieId]);
    return rows.map(row => new Actor(row));
  }

  static async findAllActors() {
    const { rows } = await pool.query(`
    SELECT * FROM actors
    `);
    return rows.map(row => new Actor(row));
  }

  static async updateActor(actorId, actor) {
    const { rows } = await pool.query(`
    UPDATE actors
    SET movie_id=$1,
        name=$2,
        oscar=$3
    WHERE id=$4
    RETURNING *
    `, [actor.movieId, actor.name, actor.oscar, actorId]);

    return new Actor(rows[0]);
  }

  static async deleteActor(actorId) {
    const { rows } = await pool.query(`
    DELETE FROM actors 
    WHERE id=$1
    RETURNING *
    `, [actorId]);

    if(!rows[0]) return null;
    else return new Actor(rows[0]);
  }
}

module.exports = Actor;
