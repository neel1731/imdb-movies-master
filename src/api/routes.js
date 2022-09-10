const { Router } = require('express');
const { searchMovies, updateDetails, findMovie , createManyMovies, createMovie, updateGeneras } = require('./imdb/imdb.controller');

const router = Router();

router.post('/movies', searchMovies);
router.post('/movie/:title', findMovie);
router.post('/movies/:id', updateDetails);
router.post('/movies/bulk' , createManyMovies);
router.post('/movies/create', createMovie);
router.put('/movies/genera', updateGeneras);

module.exports = router;