const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth")


const Chatroom = require("../models/chatroom");
const User = require("../models/user");


router.post("/sendmsg/:cid",checkAuth,(req,res,next)=>{
  Chatroom.updateOne(
    { $or: [
        { _id: req.params.cid, creatorUserId: req.userData.userId},
        { _id: req.params.cid, currentContributerUser: req.userData.userId}
      ]
    },
    { $push: {
         messages: {
           date: req.body.date,
           senderId: req.userData.userId,
           body: req.body.body
         }
      }
    }
  )
  .exec()
  .then(doc => {
    res.status(200).json({
      status: "success",
      message: "Message sent"
    })
  })
  .catch( err => {
    res.status(500).json({
      status: "error",
      message: err.toString()
    });
  })
});

router.patch("/join/:cid",checkAuth,(req,res,next)=>{
  Chatroom.updateOne(
    { _id: req.params.cid, status: "pending"},
    {
      $set: {status: "inprogress", currentContributerUser: req.userData.userId},
      $push: { contributorsIds: req.userData.userId}
    })
  .exec()
  .then(doc => {
    res.status(200).json({
      status: "success",
      message: "Chatroom successfully joined!"
    })
  })
  .catch( err => {
    res.status(500).json({
      status: "error",
      message: err.toString()
    });
  })
});

router.patch("/end/:cid/:state",checkAuth,(req,res,next)=>{
  Chatroom.findOne({ _id: req.params.cid, status: "inprogress"})
  .exec()
  .then(result=>{

    if (req.params.state.toString().toLowerCase() === "answered") {
      if (req.userData.userId.toString() !== result.creatorUserId.toString()) {
        return res.status(500).json({
          status: "error",
          message: "Unauthorized to end"
        });
      }
      result.status = "done";
      result.save()
      .then(doc=>{
        res.status(201).json({
          status: "success",
          message: "Chatroom closed!"
        });
      })

    }else if(req.params.state.toString().toLowerCase() === "notanswered"){
      if (req.userData.userId.toString() === result.creatorUserId.toString() || req.userData.userId.toString() === result.currentContributerUser.toString()){
        result.status = "pending";
        result.currentContributerUser = null;
        result.save()
        .then(doc=>{
          res.status(201).json({
            status: "success",
            message: "Chatroom reset to pending!"
          });
        })
      }else {
        return res.status(500).json({
          status: "error",
          message: "Unauthorized to end"
        });
      }
    }

  })
  .catch( err => {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: err.toString()
    });
  })
});

router.get("/getmsgs/:cid",checkAuth,(req,res,next)=>{

  Chatroom.findOne({_id: req.params.cid})
  .select("_id creatorUserId currentContributerUser messages")
  .populate("messages.senderId","_id firstName")
  .exec()
  .then(result => {
    if((result.creatorUserId.toString() === req.userData.userId.toString()) || (result.currentContributerUser.toString() === req.userData.userId.toString())){

      var latest = (req.query.latest) ? ( parseInt(req.query.latest) ) : (0);

      res.status(200).json({
        status: "success",
        message: result.messages.filter( msg => (msg.date > latest) ) // filtering out old messages
      })
    }else{
      res.status(500).json({
        status: "error",
        message: "Unauthorized to view"
      });
    }
  })
  .catch( err => {
    res.status(500).json({
      status: "error",
      message: err.toString()
    });
  })
});

router.get("/:cid",checkAuth,(req,res,next)=>{
  Chatroom.findOne({_id: req.params.cid})
  .select("_id status creatorUserId subject roleNeeded skillsNeeded currentContributerUser contributorsIds")
  .populate("creatorUserId","_id firstName lastName email")
  .populate("currentContributerUser","_id firstName lastName email")
  .exec()
  .then(result => {
    if((result.creatorUserId._id.toString() === req.userData.userId.toString()) || (result.currentContributerUser._id.toString() === req.userData.userId.toString())){

      res.status(200).json({
        status: "success",
        message: result
      })
    }else{
      res.status(500).json({
        status: "error",
        message: "Unauthorized to view"
      });
    }
  })
  .catch( err => {
    res.status(500).json({
      status: "error",
      message: err.toString()
    });
  })
});

router.get("/",checkAuth,(req,res,next)=>{
  var query;
  if(req.query.status){
    query = Chatroom.find({status: req.query.status.toString().toLowerCase()});
  }else{
    query = Chatroom.find();
  }
  query
  .select("_id creatorUserId subject roleNeeded skillsNeeded status")
  .populate("creatorUserId","firstName lastName email rating")
  .exec()
  .then(docs => {
    res.status(200).json({
      status: "success",
      message: docs
    })
  })
  .catch( err => {
    res.status(500).json({
      status: "error",
      message: err.toString()
    });
  })
});

router.post("/",checkAuth,(req,res,next)=>{
  const chatroom = new Chatroom({
    creatorUserId: req.userData.userId,
    subject: req.body.subject,
    roleNeeded: req.body.roleNeeded,
    skillsNeeded: req.body.skillsNeeded || [],
    contributorsIds: [],
    messages:[]
  });
  chatroom.save()
  .then(result => {
    console.log(result);
    res.status(201).json({
      status: "success",
      message: "Chatroom successfully created"
    });
  })
  .catch(err => {
    res.status(500).json({
      status: "error",
      message: err.toString()
    });
  })
});

module.exports = router;
