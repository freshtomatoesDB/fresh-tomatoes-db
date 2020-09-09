const pool = require('../utils/pool');

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
}

module.exports = Movie;
