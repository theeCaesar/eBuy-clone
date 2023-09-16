const exp = require('express');
const authControllers = require('../controllers/authControllers');
const userControllers = require('../controllers/userControllers');

router = exp.Router();

router.route('/signup').post(authControllers.signup());
router.route('/login').post(authControllers.login);
router.route('/forgetPassword').post(authControllers.forgetPassword);
router.route('/resetPassword/:token').patch(authControllers.resetPassword);
router
  .route('/updatePassword')
  .patch(authControllers.protect, authControllers.updatePassword);

router
  .route('/updateMyAccount')
  .patch(
    authControllers.protect,
    userControllers.uploadUserProfilePicture,
    userControllers.resizeUserProfilePicture,
    userControllers.updateUser,
  );

router
  .route('/deleteMyAccount')
  .delete(authControllers.protect, userControllers.deleteUser);

router
  .route('/myAccount')
  .get(authControllers.protect, userControllers.myAccount);

router.route('/userProducts/:userId').get(userControllers.userProducts);

router.route('/:userId').get(userControllers.userAccount);

module.exports = router;
