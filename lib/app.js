const express = require('express');
const app = express();
const Movie = require('./models/movie');
const Actor = require('./models/actor');

app.use(express.json());

app.post('/api/movies', async(req, res, next) => {
  try {
    const createdMovie = await Movie.insertMovie(req.body);
    res.send(createdMovie);
  } catch(error) {
    next(error);
  }
});

app.get('/api/movies', async(req, res, next) => {
  try {
    const response = await Movie.findAllMovies();
    res.send(response);
  } catch(error) {
    next(error);
  }
});

app.get('/api/movies/:id', async(req, res, next) => {
  try {
    const response = await Movie.findMovieById(req.params.id);
    res.send(response);
  } catch(error) {
    next(error);
  }
});

app.get('/api/movieswithactors/:id', async(req, res, next) => {
  try {
    const response = await Movie.findActorsByMovieId(req.params.id);
    res.send(response);
  } catch(error) {
    next(error);
  }
});

app.put('/api/movies/:id', async(req, res, next) => {
  try {
    const response = await Movie.updateMovie(req.params.id, req.body);
    res.send(response);
  } catch(error) {
    next(error);
  }
});

app.delete('/api/movies/:id', async(req, res, next) => {
  try {
    const response = await Movie.delete(req.params.id);
    res.send(response);
  } catch(error) {
    next(error);
  }
});

app.post('/api/actors', async(req, res, next) => {
  try {
    const createdActor = await Actor.insertActor(req.body);
    res.send(createdActor);
  } catch(error) {
    next(error);
  }
});

app.get('/api/actors', async(req, res, next) => {
  try {
    const response = await Actor.findAllActors();
    res.send(response);
  } catch(error) {
    next(error);
  }
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
