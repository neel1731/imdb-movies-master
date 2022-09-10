const httpStatus = require('http-status');
const Movie = require('./imdb.models');
const { getMovieDetails } = require('./imdb.helper');

const findMovie = async (req, res) => {
  try {
    const { title } = req.params || '';
    const movieInDB = await Movie.findOne({
      title: {
        $regrex: title,
        $options: 'i'
      }
    }).select('-_id -createdAt -updatedAt');
    if (movieInDB) {
      return res.status(httpStatus.OK).json(movieInDB)
    }
    const movie = await getMovieDetails(title);
    await Movie.create(movie);
    res.status(httpStatus.OK).json(movie)
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      err: err.message,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}

const updateDetails = async (req, res) => {
  try {
    const { rating, generas } = req.body;
    const { id } = req.params;
    const movie = await Movie.findOne({ id });
    if (!movie) {
      throw Error('No movie found for given ID')
    }
    if (rating) {
      movie.rating = rating;
    }
    if (generas) {
      movie.generas = generas;
    }
    await movie.save();
    res.status(httpStatus.OK).json(movie)
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      err: err.message,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}

const searchMovies = async (req, res) => {
  try {
    const { ratings, query, generas, years } = req.body;
    const queryObj = {}
    if (ratings) {
      if (ratings.length > 1) {
        queryObj.rating = { $gte: ratings[0], $lte: ratings[1] }
      } else {
        queryObj.rating = { $gte: ratings[0] }
      }
    }
    if (years) {
      if (years.length > 1) {
        queryObj.years = { $gte: years[0], $lte: years[1] }
      } else {
        queryObj.years = { $gte: years[0] }
      }
    }
    if (generas) {
      queryObj.generas = { $in: generas }
    }
    if (query) {
      queryObj.$or = [
        { id: query },
        {
          title: {
            $regrex: query,
            $options: 'i'
          }
        }
      ]
    }
    const movies = await Movie.find(queryObj);
    res.status(httpStatus.OK).json(movies)
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      err: err.message,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}

const createManyMovies = async (req, res) => {
  try {
    const {
      title, years, rating, id, generas
    } = req.body
    const movies = await Movie.insertMany(
      [
        {
          title, years, rating, id, generas
        }
      ],
    )
    res.status(httpStatus.OK).json(movies)
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      err: err.message,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}

const createMovie = async (req, res) => {
  try {
    const {
      title, years, rating, id, generas
    } = req.body
    const movies = await Movie.create(
      [
        {
          title, years, rating, id, generas
        }
      ],
    )
    res.status(httpStatus.OK).json(movies)
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      err: err.message,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}

const updateGeneras = async (req, res) => {
  try {
    const { generas } = req.body;
    const { id } = req.params;
    let updatedGenera = await Movie.findOneAndUpdate(
      { _id: id },
      { $set: { generas } },
      {
        new: true,
        upsert: true // Make this update into an upsert
      }
    );
    res.status(httpStatus.OK).json(updatedGenera)
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      err: err.message,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}

module.exports = {
  findMovie,
  updateDetails,
  searchMovies,
  createManyMovies,
  createMovie,
  updateGeneras
}

// Create Movies
// Add generas in movies
