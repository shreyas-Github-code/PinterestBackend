var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterestapp");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
   {type:mongoose.Schema.Types.ObjectId,
  ref:'Post'}
  ],
  dp: {
    type: String,
    default: 'default-profile-picture.jpg', // You can set a default profile picture
  },
  email: {
    type: String,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
})


module.exports = mongoose.model('User',userSchema);
