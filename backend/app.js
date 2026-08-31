
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const userRoutes = require('./routes/userRoutes');

const AppError = require('./utils/AppError');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).type('text/plain').send('Welcome to Book Store API (MongoDB + Auth)');
});

app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/', userRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorMiddleware);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`📚 Book Store API running at http://localhost:${PORT}`);
  });
}

start();

module.exports = app;
