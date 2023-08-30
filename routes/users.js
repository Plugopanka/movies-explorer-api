const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, changeUserInfo } = require('../controllers/users');
const { regex } = require('../utils/constants');

router.get('/me', getUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().pattern(regex),
    }),
  }),
  changeUserInfo,
);

module.exports = router;
