const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

router.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
