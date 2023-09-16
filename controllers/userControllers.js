const catchAsyncErrors = require('../utils/catchAsyncErrors');
const Users = require('../models/userModel');
const Products = require('../models/productsModel');
const appError = require('../utils/appError');
const APIFeatures = require('../utils/APIFeatures');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('not image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserProfilePicture = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
]);

exports.resizeUserProfilePicture = catchAsyncErrors(async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  req.body.profilePicture = `userProfilePicture-${
    req.user._id
  }-${Date.now()}.jpeg`;

  await sharp(req.files.profilePicture[0].buffer)
    .resize(200, 200, { fit: 'contain' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/user/${req.body.profilePicture}`);

  next();
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const { email, displayName, profilePicture } = req.body;

  // req.user.email = email || req.user.email
  req.user.displayName = displayName || req.user.displayName;
  req.user.profilePicture = profilePicture || req.user.profilePicture;
  await req.user.save();

  res.status(200).json({
    status: 'success',
    message: 'user updated',
  });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  let deletedUser;

  if (req.user.role === 'admin') {
    deletedUser = await Users.findOneAndDelete({ _id: req.params.userId });
    await deletefiles(
      [`public/images/user/${deletedUser.profilePicture}`],
      next,
    );
  } else {
    deletedUser = await Users.findByIdAndUpdate(req.user._id, {
      active: false,
    });
  }

  if (!deletedUser) {
    return next(new appError('user not found', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'user is not active',
  });
});

exports.userProducts = catchAsyncErrors(async (req, res, next) => {
  const features = new APIFeatures(
    Products.find({ user: req.params.userId }),
    req.query,
  )
    .filter()
    .sort()
    .paginaaton()
    .selectFields();

  const products = await features.query;

  if (!products) return next(new appError('no user or no products', 404));

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

exports.userAccount = catchAsyncErrors(async (req, res, next) => {
  const user = await Users.findById(req.params.userId).select(
    'displayName profilePicture',
  );

  if (!user) {
    return next(new appError('user not found', 404));
  }

  const { displayName, profilePicture } = user;

  res.status(200).json({
    status: 'success',
    data: {
      displayName,
      profilePicture,
    },
  });
});

exports.myAccount = catchAsyncErrors(async (req, res, next) => {
  const { displayName, profilePicture, _id, email } = req.user;

  res.status(200).json({
    status: 'success',
    data: {
      displayName,
      profilePicture,
      _id,
      email,
    },
  });
});

// exports.banUser = catchAsyncErrors(async (req, res, next) => {
//     if (!req.body.bannedFor) return next(new appError('banned untill is not provided', 400))
//     await Users.findOneAndUpdate({_id : req.params.userId }, {bannedUntill: req.body.bannedUntill, active: false})
//     res.status(200).json({
//         status: 'success'
//     })
// })
