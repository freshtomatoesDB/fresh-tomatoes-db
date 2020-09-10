const express = require('express');
const app = express();
const Movie = require('./models/movie');

app.use(express.json());

app.post('/api/movies', async(req, res, next) => {
  try {
    const createdMovie = await Movie.insert(req.body);
    res.send(createdMovie);
  } catch(error) {
    next(error);
  }
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
