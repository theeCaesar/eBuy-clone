const Reviews = require('../models/reviewsModel');
const APIFeatures = require('../utils/APIFeatures');
const appError = require('../utils/appError');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

exports.createReview = catchAsyncErrors(async (req, res, next) => {
  req.body.product = req.params.productId;
  req.body.user = req.user._id;

  const newReview = await Reviews.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const features = new APIFeatures(
    Reviews.find({ product: req.params.productId }).populate({
      path: 'user',
      select: 'displayName _id profilePicture',
    }),
    req.query,
  )
    .sort()
    .paginaaton();

  const productReviews = await features.query;

  if (!productReviews) {
    return next(new appError('no reviews', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      productReviews,
    },
  });
});

exports.updateReview = catchAsyncErrors(async (req, res, next) => {
  const updatedReview = await Reviews.findOne({
    product: req.params.productId,
    user: req.user._id,
  });

  if (!updatedReview) {
    return next(new appError('no review', 404));
  }
  updatedReview.rating = req.body.rating || updatedReview.rating;
  updatedReview.review = req.body.review || updatedReview.review;
  await updatedReview.save();

  res.status(200).json({
    status: 'success',
    data: updatedReview,
  });
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role === 'admin') {
    if (!(await Reviews.deleteReview({ _id: req.params.reviewId })))
      return next(new appError('no review', 404));
  } else {
    if (
      !(await Reviews.deleteReview({
        product: req.params.productId,
        user: req.user._id,
      }))
    )
      return next(new appError('no review', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'review deleted',
  });
});
