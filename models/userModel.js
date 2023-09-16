const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const usersSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: [true, 'insert the user displayName'],
    },
    profilePicture: {
      type: String,
      default: 'default-avatar-icon-of-user.jpg',
    },
    email: {
      type: String,
      required: [true, 'insert the user email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'email is not valid'],
      //  {
      //   validator: function(v) {
      //     console.log(v);
      //     return validator.isEmail(this.get('email'))
      //   },
      //   message: 'email is not valid'
      // }
    },
    description: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super user'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'insert the user password'],
      minlength: 8,
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    bannedUntill: {
      type: Number,
      default: 0,
    },
    // passwordConform: {
    //     type: String,
    //     required: [true, 'insert the user conformPassword']
    // },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExp: Date,
  },
  {
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
    id: false,
  },
);

usersSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000 * 60 * 5;
  next();
});

usersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

usersSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

usersSchema.methods.checkPassword = async function (
  inputPassword,
  userPassword,
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

usersSchema.methods.checkChangedPassword = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const holder = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < holder;
  }

  return false;
};

usersSchema.methods.resetPasswordToken = function () {
  const resetToken = crypto.randomBytes(13).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExp = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
