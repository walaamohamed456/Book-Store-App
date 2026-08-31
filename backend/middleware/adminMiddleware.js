const AppError = require('../utils/AppError');

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authorized.', 401));
  }
  if (req.user.role !== 'admin') {
    return next(new AppError('Forbidden. Admin access required.', 403));
  }
  next();
};

module.exports = adminMiddleware;
