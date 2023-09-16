const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'insert the product name'],
    },
    reviewsNumber: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
      set: (val) => Math.round(val * 10) / 10,
      // validate: {
      //     validator: function (val) {
      //         console.log(this);
      //         return this.get('rating') == 3
      //     },
      //     message: 'gg'
      // }
    },
    images: {
      type: [String],
      required: [true, 'the product must have at least one image'],
    },
    coverImage: {
      type: String,
      required: [true, 'the product must have cover Image'],
    },
    description: {
      type: String,
      required: [true, 'the product must have a description'],
    },
    price: {
      type: Number,
      required: [true, 'the product must have a price'],
    },
    tags: {
      type: [String],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'the product must belong to a user'],
    },
  },
  {
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
    id: false,
    timestamps: true,
  },
);

productsSchema.index({ price: 1 });
productsSchema.index({ tags: 1 });

productsSchema.virtual('price50%Off').get(function () {
  return this.price / 2;
});

productsSchema.virtual('reviews', {
  ref: 'Reviews',
  foreignField: 'product',
  localField: '_id',
});

// productsSchema.pre(/^find/, async function(next) {
//     this.populate({
//         path: 'user',
//         select: 'displayName _id profilePicture'
//       })
//     next()
// })

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;
