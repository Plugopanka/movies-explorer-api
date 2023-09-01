const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { regex } = require('../utils/constants');

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2).max(30),
      duration: Joi.string().required().min(2).max(30),
      year: Joi.string().required().min(2).max(30),
      description: Joi.string().required().min(2).max(30),
      image: Joi.string().required().pattern(regex),
      trailerLink: Joi.string().required().pattern(regex),
      thumbnail: Joi.string().required().pattern(regex),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().min(2).max(30),
      nameEN: Joi.string().required().min(2).max(30),
    }),
  }),
  createMovie,
);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
