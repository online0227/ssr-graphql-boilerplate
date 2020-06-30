const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var generator = require('generate-password');
const axios = require('axios');
const io = require('../socket');
const config = require('../config');
require('dotenv').config()
const secret = process.env.JWT_SECRET;

const createToken = (user, secret, expiresIn) => {

  const { userName, email } = user;

  return jwt.sign({
    userName, email
  }, secret, { expiresIn })

}

exports.resolvers = {

  Query: {

    getCurrentUser: async (root, args, { User, currentUser, isAuth }) => {
      if (!currentUser) {
        return null;      }

      const user = await User.findOne({ email: currentUser.email });
      return user;
    },

    getUserProfile: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null
      }
      const user = await User.findOne({ email: currentUser.email })
      return user;
    },

    getAllUsers: async (root, args, { User }) => {
      const users = await User.find().sort({
        createdAt: "desc"
      });

      return users;
    },

    profilePage: async (root, { userName }, { User }) => {
      const profile = await User.findOne({ userName });
      return profile;
    }

  },

  Mutation: {

    signupUser: async (root, { email, userName, password }, { User }) => {

      const user = await User.findOne({ email, userName });

      if (user) {
        throw new Error('User already exits');
      }

      const newUser = await new User({
        email,
        userName,
        password
      }).save();
      
      io.getIO().emit('users', {
        action: 'signup',
        user: { ...newUser._doc }
      });

      return { token: createToken(newUser, secret, "1hr") };
    },

    signinUser: async (root, { email, password }, { User }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('User Not Found');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('inValid password');
      }

      io.getIO().emit('users', {
        action: 'login',
        user: { ...user._doc }
      });

      return { token: createToken(user, secret, "1hr") };

    },

    editProfile: async (root, { email, bio }, { User }) => {

      const user = await User.findOneAndUpdate({ email }, { $set: { bio } }, { new: true });

      if (!user) {
        throw new Error('User Not Found');
      }

      return user;
    },

    setProfileIMG: async (root, { email, profileImage }, { User }) => {
      const user = await User.findOneAndUpdate({ email }, { $set: { profileImage } }, { new: true });

      if (!user) {
        throw new Error('User Not Found');
      }

      return user;

    },

    changeEmail: async (root, { currentEmail, newEmail }, { User }) => {

      const user = await User.findOneAndUpdate({ email: currentEmail }, { $set: { email: newEmail } }, { new: true });

      if (!user) {
        throw new Error('User Not Found');
      }

      return user;

    },

    changePassword: (root, { email, password }, { User }) => {

      const saltRounds = 10;

      return bcrypt.hash(password, saltRounds).then(async function (hash) {

        const user = await User.findOneAndUpdate({ email }, { $set: { password: hash } }, { new: true });

        if (!user) {
          throw new Error('User Not Found');
        }

        return user;

      });

    },

    passwordReset: async (root, { email }, { User }) => {

      const saltRounds = 10;
      const generatedPassword = generator.generate({ length: 10, numbers: true });

      return bcrypt.hash(generatedPassword, saltRounds).then(async function (hash) {

        const user = await User.findOneAndUpdate({ email }, { $set: { password: hash } }, { new: true });

        if (!user) {
          throw new Error('User Not Found');
        } else {

          const data = {
            email,
            generatedPassword
          }


          axios.post(`${config.hostUrl}/password-reset`, data)
            .then(function (response) {            })
            .catch(function (error) {            });


        }

        return user;

      });



    }


  }
};