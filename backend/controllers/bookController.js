
const mongoose = require('mongoose');
const Book = require('../models/Book');
const AppError = require('../utils/AppError');

const getAllBooks = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);
    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 10;

    const skip = (page - 1) * limit;

    const query = Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (req.query.populateAuthor === 'true') {
      query.populate('authorRef', 'name bio birthYear email');
    }

    const [books, totalItems] = await Promise.all([query.exec(), Book.countDocuments()]);

    res.status(200).json({
      data: books,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.max(Math.ceil(totalItems / limit), 1),
        hasNextPage: page * limit < totalItems,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /books/:id  (PUBLIC)
const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid book id.', 400));
    }

    const book = await Book.findById(id).populate('authorRef', 'name bio birthYear email');

    if (!book) {
      return next(new AppError(`Book with id ${id} not found.`, 404));
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// POST /books  (authMiddleware — any logged-in user)
const createBook = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.user) {
      payload.createdBy = req.user.id;
    }
    const book = await Book.create(payload);
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// PUT /books/:id  (PUBLIC — unchanged)
const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid book id.', 400));
    }

    const book = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return next(new AppError(`Book with id ${id} not found.`, 404));
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid book id.', 400));
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return next(new AppError(`Book with id ${id} not found.`, 404));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
