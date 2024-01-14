var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const userModel = require('./users');
const postModel = require('./posts');
mongoose.connect("mongodb://127.0.0.1:27017/pinterestapp");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/createuser', async function (req, res, next) {
  let createduser = await userModel.create({
    username: 'harsh',
    password: 'hardsh',
    psost: [],
    email: 'harsh@mail.com',
    fullname: 'harsh vardan kapoor'
  });
  res.send(createduser);
});

router.get('/allposts', async function (req, res, next) {
  let all = await userModel.findOne({_id:"65a3bb063a7068672c0a9979"}).populate('posts');
  res.send(all);
});

router.get('/createpost', async function (req, res, next) {
  const post = await postModel.create({
    postText: 'id like to say its my 3rd post',
    user: "65a3bb063a7068672c0a9979",
  });

  let user =await userModel.findOne({_id:'65a3bb063a7068672c0a9979'});
  user.posts.push(post._id);
  user.save();
  res.send(post);
});

module.exports = router;
