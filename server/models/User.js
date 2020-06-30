const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
import { counter } from './sequence';

const UserSchema = new Schema(
  {
    uid: Number,
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    userName: {
      type: String,
      required: true,
      unique: true
    },
    bio: {
      type: String
    },
    profileImage: {
      type: String
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', function save(next) {
  const user = this;

  const name = 'user_counter';  counter.findByIdAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { upsert: true, new: true }, function (err, result) {
    if (err) {
      return next(err);
    }
    user.uid = result.seq;    
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, function(err, salt) {
      if (err) { return next(err); }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) { return next(err); }
        user.password = hash;
        next();
      });
    });
  });
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};


module.exports = mongoose.model('User', UserSchema);
