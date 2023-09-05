const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEXP } = require('../constants/regexp');

const {
  getCurrentUserMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getCurrentUserMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().uri().pattern(REGEXP),
    trailerLink: Joi.string().required().uri().pattern(REGEXP),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().uri().pattern(REGEXP),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex(),
  }),
}), deleteMovie);

module.exports = router;
