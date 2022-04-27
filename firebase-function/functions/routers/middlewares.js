/**
 * Middleware Authentication:
 * Current only allow admin from localhost - dev mode
 */
const isAdminGroup = (req, res, next) => {
  if (req.get('host') === 'localhost:5001') {
    return next();
  }

  return res.redirect('/');
};

module.exports = {
  isAdminGroup
};
