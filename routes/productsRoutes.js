const exp = require('express');
const productsControllers = require('../controllers/productControllers');
const authControllers = require('../controllers/authControllers');
const reviewsRouter = require('./reviewsRoutes');

router = exp.Router({ mergeParams: true });

router
  .route('/')
  .get(productsControllers.getProducts)
  .post(
    authControllers.protect,
    authControllers.onlyPermission('user'),
    productsControllers.uploadProductImages,
    productsControllers.resizeProductImages,
    productsControllers.createProduct,
  );

router
  .route('/:productId')
  .get(productsControllers.getProduct)
  .patch(
    authControllers.protect,
    authControllers.onlyPermission('user'),
    productsControllers.uploadProductImages,
    productsControllers.resizeProductImages,
    productsControllers.updateProduct,
  )
  .delete(authControllers.protect, productsControllers.deleteProduct);

router.use('/:productId/reviews', reviewsRouter);

module.exports = router;
