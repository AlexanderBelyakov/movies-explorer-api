const Movie = require('../models/movie');
const {
  OK,
  CREATED,
  BAD_REQUEST_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND_ERROR,
} = require('../constants/HHTP-status-codes');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCurrentUserMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .orFail(new Error('NotValidOwnerId'))
    .then((movies) => res.status(OK).send(movies))
    .catch((err) => {
      if (err.message === 'NotValidOwnerId') {
        next(new NotFoundError(`Передан id несуществующего пользователя ${NOT_FOUND_ERROR}`));
      }
      return next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные при создании фильма ${BAD_REQUEST_ERROR}`));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id: movieId } = req.params;
  Movie.findById(movieId)
    .orFail(new Error('NotValidId'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(movieId).then(() => res.status(OK).send(movie));
      } else {
        throw new ForbiddenError(`Нет прав на удаление фильма ${FORBIDDEN_ERROR}`);
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError(`Передан id несуществующего фильма ${NOT_FOUND_ERROR}`));
      }
      return next(err);
    });
};
