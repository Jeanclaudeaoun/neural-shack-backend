const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth")


const Chatroom = require("../models/chatroom");
const User = require("../models/user");


router.get("/:cid",checkAuth,(req,res,next)=>{
  var query = Chatroom.findOne({_id: req.params.cid});

  if(req.query.onlymsgs){ // if ?onlymsgs is available in the url
    if(req.query.onlymsgs.toString() === "true"){
      query.select("_id creatorUserId currentContributerUser messages")
      if (req.query.latest){
        query.where('messages.date').gt( parseInt(req.query.latest) ) 
      }
    }
  }

  query.exec()
  .then(result => {
    if((result.creatorUserId.toString() === req.userData.userId.toString()) || (result.currentContributerUser.toString() === req.userData.userId.toString())){
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
