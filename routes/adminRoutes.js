const exp = require('express');
const productsControllers = require('../controllers/productControllers');
const authControllers = require('../controllers/authControllers');
const reviewControllers = require('../controllers/reviewControllers');
const reviewsRouter = require('./reviewsRoutes');
const productsRouter = require('./productsRoutes');
const userControllers = require('../controllers/userControllers');

router = exp.Router();

router.route('/signup').post(authControllers.signup('admin'));

router.use(authControllers.protect);
router.use(authControllers.onlyPermission('admin'));

router.use('/deleteReview/:reviewId', reviewsRouter);

router.use('/deleteProduct/:productId', productsRouter);

router.route('/deleteUser/:userId').delete(userControllers.deleteUser);
// router.route('/banUser/:userId').patch(userControllers.banUser)

module.exports = router;
