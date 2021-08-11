module.exports = (req, res, next) => {
  res.locals.userData = req.session.user;
  next();
};
