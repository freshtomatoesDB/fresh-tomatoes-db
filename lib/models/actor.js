const pool = require("../utils/pool");

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
}

module.exports = Actor;
