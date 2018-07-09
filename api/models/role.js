const mongoose = require('mongoose');

module.exports = mongoose.model('Role', mongoose.Schema({

  roleName: { type: String, required: true },

  defaultSkills: [String]

}));
