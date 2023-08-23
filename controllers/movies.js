const Movie = require('../models/movie');
const { STATUS_CODE_POST } = require('../errors/errors');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Movie.create({ name, link, owner })
    .then((movies) => res.status(STATUS_CODE_POST).send({ data: movies }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }

      return next(err);
    });
};

// module.exports.deleteMovie = (req, res, next) => {
//   Movie.findById(req.params.movieId)
//     .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
//     .then((movie) => {// eslint-disable-line
//       if (String(movie.owner) !== String(req.user._id)) {
//         return next(new ForbiddenError('Нет доступа для удаления карточки'));
//       }
//       Movie.deleteOne()
//         .then(() => res.send({ data: movie }))
//         .catch(next);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return next(
//           new BadRequestError(
//             'Переданы некорректные данные при удалении карточки',
//           ),
//         );
//       }

//       return next(err);
//     });
// };

module.exports.likeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка',
          ),
        );
      }

      return next(err);
    });
};

module.exports.dislikeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError('Переданы некорректные данные для снятия лайка'),
        );
      }

      return next(err);
    });
};
