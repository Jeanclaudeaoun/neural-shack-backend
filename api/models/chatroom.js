const mongoose = require('mongoose');


module.exports = mongoose.model('Chatroom', mongoose.Schema({

  status: { type: String, default: "pending" }, // pending || inprogress || done

  creatorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  subject: { type: String, required: true},

  roleNeeded: { type: String, required: true },

  skillsNeeded: [String],

  currentContributerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},

  contributorsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

  messages: [{
    date: { type: Number }, // number of seconds
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    body: String
  }]

}));
