const mongoose = require('mongoose');

module.exports = mongoose.model('User', mongoose.Schema({

  firstName: { type: String, required: true },

  lastName: { type: String, required: true },

  dateOfBirth: { type: String, required: true },

  gender: String,

  email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },

  password: { type: String, required: true },

  verified: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },

  roles: [String],

  skills: [String],

  rating: { type: Number, min: 0, max: 5, default: 0 },

  nbOfRatings: { type: Number, default:0 }


}));
