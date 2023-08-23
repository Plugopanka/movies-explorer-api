const Movie = require('../models/movie');
const { STATUS_CODE_POST } = require('../errors/errors');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, thumbnail, nameRU, nameEN } = req.body;
  const owner = req.user._id;
  Movie.create({ country, director, duration, year, description, image, trailerLink, thumbnail, nameRU, nameEN, owner })
    .then((movie) => res.status(STATUS_CODE_POST).send(movie))
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

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((movie) => {// eslint-disable-line
      if (String(movie.owner) !== String(req.user._id)) {
        return next(new ForbiddenError('Нет доступа для удаления карточки'));
      }
      Movie.deleteOne()
        .then(() => res.send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при удалении карточки',
          ),
        );
      }

      return next(err);
    });
};

// module.exports.likeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
//     .then((card) => res.send(card))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return next(
//           new BadRequestError(
//             'Переданы некорректные данные для постановки лайка',
//           ),
//         );
//       }

//       return next(err);
//     });
// };

// module.exports.dislikeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
//     .then((card) => res.send(card))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return next(
//           new BadRequestError('Переданы некорректные данные для снятия лайка'),
//         );
//       }

//       return next(err);
//     });
// };
