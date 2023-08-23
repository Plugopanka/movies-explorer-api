const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
  // likeCard,
  // dislikeCard,
} = require('../controllers/movies');
const regex = require('../utils/constants');

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(regex),
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
// router.put(
//   '/:cardId/likes',
//   celebrate({
//     params: Joi.object().keys({
//       cardId: Joi.string().length(24).hex().required(),
//     }),
//   }),
//   likeCard,
// );
// router.delete(
//   '/:cardId/likes',
//   celebrate({
//     params: Joi.object().keys({
//       cardId: Joi.string().length(24).hex().required(),
//     }),
//   }),
//   dislikeCard,
// );

module.exports = router;
