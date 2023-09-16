exp = require('express');
const reviewControllers = require('../controllers/reviewControllers');
const authControllers = require('../controllers/authControllers');

router = exp.Router({ mergeParams: true });

router.use(authControllers.protect);
router.use(authControllers.onlyPermission('user'));

router
  .route('/')
  .post(reviewControllers.createReview)
  .get(reviewControllers.getProductReviews)
  .patch(reviewControllers.updateReview)
  .delete(reviewControllers.deleteReview);

module.exports = router;
