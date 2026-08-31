// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userController.register); // PUBLIC
router.post('/login', userController.login); // PUBLIC
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;
