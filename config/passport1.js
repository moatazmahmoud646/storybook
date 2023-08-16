/*
//const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const Register = require('../models/Register')
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
//const bcrypt = require('bcryptjs');
//const user_login = require('../models/Register');


module.exports = function (passport1) {
 // Local authentication strategy
passport1.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  async (email, password, done) => {
    try {
      // Find user by email
      const user_login = await Register.findOne({ email });

      // Check if user existsm
      if (!user_login) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Check if password matches
      const passwordMatch = await bcrypt.compare(password, user_login.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user_login);
    } catch (err) {
      console.error(err);
      return done(err);
    }
  }
));


  passport1.serializeUser((user, done) => {
    done(null, user.id)
    console.log("serializeUser")
  })

  passport1.deserializeUser( async (id, done) => {
   
    const user = await Register.findById(id);
    if(user) done(null,user)

    else done("id not existsssss", null)
    {    console.log("existsssss")
}
  })

}*/