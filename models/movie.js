const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (l) => validator.isURL(l),
      message: 'Передана некорректная ссылка',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (l) => validator.isURL(l),
      message: 'Передана некорректная ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (l) => validator.isURL(l),
      message: 'Передана некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
  movieId: {
    type: Number,
    required: true,
    // ref: 'movie',
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('movie', movieSchema);
