// controllers/authorController.js
const mongoose = require('mongoose');
const Author = require('../models/Author');
const AppError = require('../utils/AppError');

const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
};

const getAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid author id.', 400));
    }
    const author = await Author.findById(id);
    if (!author) {
      return next(new AppError(`Author with id ${id} not found.`, 404));
    }
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};

const createAuthor = async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
};

const updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid author id.', 400));
    }
    const author = await Author.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!author) {
      return next(new AppError(`Author with id ${id} not found.`, 404));
    }
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};

const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid author id.', 400));
    }
    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      return next(new AppError(`Author with id ${id} not found.`, 404));
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
