const mongoose = require('mongoose');


module.exports = mongoose.model('Chatroom', mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  status: { type: String, default: "pending" }, // pending || inProgress || done

  creatorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  subject: { type: String, required: true},

  roleNeededId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },

  skillsNeeded: [String],

  contributorsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

  messages: [{
    date: { type: Date, required:true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: String
  }]

}));
