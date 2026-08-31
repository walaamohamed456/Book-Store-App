const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

router.post('/', authMiddleware, bookController.createBook);
router.put('/:id', bookController.updateBook);

router.delete('/:id', authMiddleware, adminMiddleware, bookController.deleteBook); // admin only

module.exports = router;
