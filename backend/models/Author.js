// models/Author.js
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Author name is required.'],
      trim: true,
      minlength: [2, 'Author name must be at least 2 characters.'],
      maxlength: [100, 'Author name must be at most 100 characters.'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio must be at most 1000 characters.'],
    },
    birthYear: {
      type: Number,
      min: [1000, 'birthYear looks too far in the past.'],
      max: [new Date().getFullYear(), 'birthYear cannot be in the future.'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'email must be a valid email address.'],
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Author', authorSchema);
