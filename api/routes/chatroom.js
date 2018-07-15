const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const Chatroom = require("../models/chatroom");

router.get("/",(req,res,next)=>{
  var query;
  if(req.query.status){
    query = Chatroom.find({status: req.query.status});
  }else{
    query = Chatroom.find();
  }
  query
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

router.post("/",(req,res,next)=>{
  const chatroom = new Chatroom({
    creatorUserId: req.body.creatorUserId,
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
