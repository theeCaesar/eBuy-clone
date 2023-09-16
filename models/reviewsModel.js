const mongoose = require('mongoose');
const Products = require('./productsModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'insert the product review'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'insert the product rating'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'review must belong to a user'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      required: [true, 'review must belong to a product/store'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    timestamps: true,
  },
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// reviewSchema.pre(/^find/, function(next) {
//     this.populate('product').populate('user')
//     next()
// })

reviewSchema.statics.avgRaiting = async function (product) {
  const stats = await this.aggregate([
    {
      $match: { product },
    },
    {
      $group: {
        _id: '$product',
        avgRating: {
          $avg: {
            $cond: [{ $gt: ['$rating', 0] }, '$rating', null],
          },
        },
        reviewsNumber: {
          $sum: {
            $cond: [{ $gt: ['$rating', 0] }, 1, 0],
          },
        },
      },
    },
  ]);
  if (stats[0]) {
    await Products.findByIdAndUpdate(product, {
      rating: stats[0].avgRating,
      reviewsNumber: stats[0].reviewsNumber,
    });
  } else {
    await Products.findByIdAndUpdate(product, {
      rating: 0,
      reviewsNumber: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.avgRaiting(this.product);
});

// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.productDoc = await this.findOne().clone();
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
//   await this.productDoc.constructor.avgRaiting(this.productDoc.product);
// });

reviewSchema.statics.deleteReview = async function (review) {
  let deletedReview = await Reviews.findOne(review);

  if (!deletedReview) return false;

  deletedReview.rating = 0;
  deletedReview = await deletedReview.save({ validateBeforeSave: false });
  await Reviews.findByIdAndRemove(deletedReview._id);
  return true;
};

const Reviews = mongoose.model('Reviews', reviewSchema);

module.exports = Reviews;
