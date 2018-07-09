const mongoose = require('mongoose');

module.exports = mongoose.model('Review', mongoose.Schema({

  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  chatroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom', required: true },

  rating: { type: Number, min: 0, max: 5, required:true },

  body: { type:String, default:"" }


}));
