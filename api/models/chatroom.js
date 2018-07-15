const mongoose = require('mongoose');


module.exports = mongoose.model('Chatroom', mongoose.Schema({

  status: { type: String, default: "pending" }, // pending || inProgress || done

  creatorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  subject: { type: String, required: true},

  roleNeeded: { type: String, required: true },

  skillsNeeded: [String],

  contributorsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

  messages: [{
    date: { type: Date },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    body: String
  }]

}));
