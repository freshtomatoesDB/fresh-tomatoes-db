const pool = require('../utils/pool');
const Actor = require('./actor');

class Movie {
  id;
  title;
  year;
  director;
  genre;
  thumbs;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.year = row.year;
    this.director = row.director;
    this.genre = row.genre;
    this.thumbs = row.thumbs;
  }

  static async insert(movie) {
    const { rows } = await pool.query(`
      INSERT INTO movies (title, year, director, genre, thumbs)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
    `, [movie.title, movie.year, movie.director, movie.genre, movie.thumbs]);

    return new Movie(rows[0]);
  }

  static async findByMovieId(movieId) {
    const { rows } = await pool.query(`
      SELECT * FROM movies
      WHERE id = $1
    `, [movieId]);

    if(!rows[0]) return null;
    else return new Movie(rows[0]);
  }

  static async findAllMovies() {
    const { rows } = await pool.query(`
    SELECT * FROM movies`
    );

    return rows.map(row => new Movie(row));
  }

  static async findActorsByMovieId(movieId) {
    const { rows } = await pool.query(`
      SELECT
        movies.*,
        array_to_json(array_agg(actors.*)) AS actors
      FROM
        movies
      JOIN
        actors
      ON
        actors.movie_id = movies.id
      WHERE
        movies.id = $1
      GROUP BY movies.id
    `, [movieId]);
    const movie = new Movie(rows[0]);
    const actors = rows[0].actors.map(actor => new Actor(actor));
    return {
      ...movie,
      actors
    };
  }

  static async update(movieId, updatedMovie) {
    const { rows } = await pool.query(`
    UPDATE movies 
    SET title = $1, 
        year = $2, 
        director = $3,
        genre = $4, 
        thumbs = $5
    WHERE id = $6
    RETURNING *
    `, [updatedMovie.title, updatedMovie.year, updatedMovie.director, updatedMovie.genre, updatedMovie.thumbs, movieId]);

    return new Movie(rows[0]);
  }

  static async delete(movieId) {
    const { rows } = await pool.query(`
    DELETE FROM movies 
    WHERE id = $1
    RETURNING *
    `, [movieId]);

    return new Movie(rows[0]);
  }
}

module.exports = Movie;
