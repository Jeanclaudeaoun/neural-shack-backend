const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.get("/",(req,res,next)=>{
  User.find()
    .exec()
    .then(users=>{
      res.status(200).json({
        status:"success",
        message: users
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      });
    })
});
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          status:"error",
          message: "e-mail already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              status: "error",
              message: err
            });
          } else {
            const user = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              dateOfBirth: req.body.dateOfBirth,
              gender: req.body.gender,
              email: req.body.email,
              password: hash,
              roles: req.body.roles || [],
              skills: req.body.skills || []
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  status: "success",
                  message: "User successfully created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  status: "error",
                  message: err
                });
              });
          }
        });
      }
    });
});



router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          status: "error",
          message: "Invalid email or password!"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            status: "error",
            message: "Invalid email or password!"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              firstName: user[0].firstName,
              lastName: user[0].lastName,
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "6h"
            }
          );
          return res.status(200).json({
            status: "success",
            message: "Authentication successful",
            token: token
          });
        }else{
          res.status(401).json({
            status: "error",
            message: "Invalid email or password!"
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      });
    });
});

// router.delete("/dall", (req, res, next) => {
//   User.remove({})
//     .exec()
//     .then(result => {
//       res.status(200).json({
//         message: "User deleted"
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

module.exports = router;
