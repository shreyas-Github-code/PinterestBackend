var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer')

passport.use(new localStrategy(userModel.authenticate()));
// mongoose.connect("mongodb://127.0.0.1:27017/pinterestapp");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {error:req.flash('error')});
});

router.get('/login', function (req, res, next) {
  res.render('login',{error:req.flash('error')});
});

router.get('/profile',isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username:req.session.passport.user,
  }).populate('posts');
  res.render('profile',{user:user});
});
router.post('/upload',isLoggedIn,upload.single('file'),  async (req, res) => {
  // Access the uploaded file details via req.file
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  const user = await userModel.findOne({
    username:req.session.passport.user,
  });
  const post = await postModel.create({
    image:req.file.filename,
    imageText:req.body.imageText,
    user:user._id,
  });

  user.posts.push(post._id);
  await user.save();

  res.redirect('profile');
});

router.get('/feed', function (req, res, next) {
  res.render('feed');
});

// router.get('/createuser', async function (req, res, next) {
//   let createduser = await userModel.create({
//     username: 'harsh',
//     password: 'hardsh',
//     psost: [],
//     email: 'harsh@mail.com',
//     fullname: 'harsh vardan kapoor'
//   });
//   res.send(createduser);
// });

// router.get('/allposts', async function (req, res, next) {
//   let all = await userModel.findOne({_id:"65a3bb063a7068672c0a9979"}).populate('posts');
//   res.send(all);
// });

// router.get('/createpost', async function (req, res, next) {
//   const post = await postModel.create({
//     postText: 'id like to say its my 3rd post',
//     user: "65a3bb063a7068672c0a9979",
//   });

//   let user =await userModel.findOne({_id:'65a3bb063a7068672c0a9979'});
//   user.posts.push(post._id);
//   user.save();
//   res.send(post);
// });

router.post('/register',(req,res)=>{
  const userData = new userModel({
    username:req.body.username,
    email:req.body.email,
    fullname:req.body.fullname,
  })

  userModel.register(userData,req.body.password)
  .then(()=>{
    passport.authenticate('local')(req,res,()=>{
      res.redirect('/profile');
    })
  })
})

router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true,
}),(req,res)=>{

})

router.get('/logout',(req,res)=>{
  req.logOut((err)=>{
    if(err){return next(err);}
    res.redirect('/login')
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}

module.exports = router;
