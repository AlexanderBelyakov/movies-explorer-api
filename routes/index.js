const router = require('express').Router();
const auth = require('../middlewares/auth');
const { NOT_FOUND_ERROR } = require('../constants/HHTP-status-codes');
const NotFoundError = require('../errors/not-found-error');

router.use('/', require('./signup'));
router.use('/', require('./signin'));

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(`Страница не найдена ${NOT_FOUND_ERROR}`));
});

module.exports = router;
