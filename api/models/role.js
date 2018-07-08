const mongoose = require('mongoose');

module.exports = mongoose.model('Role', mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  roleName: { type: String, required: true },

  defaultSkills: [String]
  
}));
