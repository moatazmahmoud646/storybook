const express= require("express");
const router = express.Router()
const Register = require("../models/Register")
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')
const bcrypt = require('bcryptjs');
const passport=require('passport')

router.get('/', ensureGuest, (req, res) => {
  res.render('login', 
  {layout: 'login'});
});

router.get('/register', ensureGuest, (req, res) => {
  res.render('register', 
  {layout: 'login'});
});


router.post('/register', async (req, res) => {
  const { name, email, password,confirmPassword,DateOfBirth } = req.body;
  try {
    const passwordRegex =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~`={}\[\]:;"'<>,.?\/\\]).{8,}$/;
    
    const userExists = await Register.findOne({ email: email });
    if (userExists) {
     // return res.render('register', { errorMessage: 'An account with this email already exists. Please log in or use a different email.' });
      res.send('<script>alert("An account with this email already exists. Please log in or use a different email."); window.history.back();</script>')
    }
    else if (password !== confirmPassword) {
      res.send('<script>alert("Passwords do not match. Please try again."); window.history.back();</script>')

      //return res.render('register', { errorMessage: 'Passwords do not match. Please try again.' });
    }
    else if (!passwordRegex.test(password)) {
      res.send('<script>alert("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."); window.history.back();</script>')
    }
    else {
      const dob = new Date(DateOfBirth);
      const now = new Date();
      const age = now.getFullYear() - dob.getFullYear();
      if (age < 18) {
        res.send('<script>alert("You must be at least 18 years old to register."); window.history.back();</script>');
      }
    
    else{
    const hashedPassword = await bcrypt.hash(password, 10);
    const user_register = new Register({ name, email,  password: hashedPassword,DateOfBirth });
    await user_register.save();
    res.render('login');
    console.log("done");
    }
  }} catch (err) {
    console.error(err);
    //console.log(req.body);
    
    res.render('register', { errorMessage: 'Registration failed. Please try again.' });
  }
});



router.get('/dashboard', ensureAuth, async (req, res)=>
{
   
  try {
      if (req.user.googleId) {
        const stories = await Story.find({  googleUser: req.user.id})
        .populate('googleUser').lean()
        res.render('dashboard', {
          
            
          
          name: req.user.firstName,
          stories,
          
        }
        );
        
      } else if (req.user.email) {
        const stories = await Story.find({emailUser: req.user.id }).populate('emailUser')
        .lean()
        res.render('dashboard', {
          name: req.user.name,
          stories,
        })

      }
      
        /*const stories = await Story.find({ user: req.user.id }).populate('emailUser')
        .populate('googleUser').lean()
        res.render('dashboard', {
          name: req.user.firstName,
          stories,
        })*/
      } 
      
      catch (err) {
        console.error(err)
        res.render('error/500')
      }
}

)
router.get('/login-email',(req, res) => {
 
  res.render('login-email', { message: req.flash('error') });
  //res.render('login-email');
});


router.post('/login-email', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login-email',
  failureFlash: true,
  passReqToCallback: true
}));
router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      req.clearCookie('connect.sid');
      return next(error);   
           
    }
    res.redirect('/');
});
})
// Login with email and password route



module.exports=router