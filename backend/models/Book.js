// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      minlength: [1, 'Title cannot be empty.'],
      maxlength: [200, 'Title must be at most 200 characters.'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required.'],
      trim: true,
      minlength: [1, 'Author cannot be empty.'],
    },
    authorRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    year: {
      type: Number,
      required: [true, 'Publication year is required.'],
      min: [1450, 'year seems too early (before the printing press).'],
      max: [new Date().getFullYear(), 'year cannot be in the future.'],
      validate: {
        validator: Number.isInteger,
        message: 'year must be an integer.',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'price cannot be negative.'],
    },
    genre: {
      type: String,
      trim: true,
      enum: {
        values: [
          'Fiction', 'Non-Fiction', 'Fantasy', 'Science Fiction',
          'Dystopian', 'Software Engineering', 'Programming', 'Biography', 'Other',
        ],
        message: '{VALUE} is not a supported genre.',
      },
      default: 'Other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
