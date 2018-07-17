const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth")


const Chatroom = require("../models/chatroom");
const User = require("../models/user");

const inArray = (str,arr) => {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].toString() === str)
      return true;
  }
  return false;
}

router.get("/:cid",checkAuth,(req,res,next)=>{
  Chatroom.findOne({_id: req.params.cid})
  .exec()
  .then(result => {
    if((result.creatorUserId.toString() === req.userData.userId.toString()) || inArray(req.userData.userId.toString(),result.contributorsIds)){
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
      message: err
    });
  })
/*
TO-DO:
  “?onlymsgs=true” gets only the messages of chatroom
  “latest=date” get messages with date > latest
*/
});

router.get("/",checkAuth,(req,res,next)=>{
  var query;
  if(req.query.status){
    query = Chatroom.find({status: req.query.status});
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
      message: err
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
      message: err
    });
  })
});

module.exports = router;
