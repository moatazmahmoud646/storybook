const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
const Register = require('../models/Register')
const bcrypt = require('bcryptjs');
const { close } = require('fs-extra');
const LocalStrategy = require('passport-local').Strategy;
//const bcrypt = require('bcryptjs');
//const user_login = require('../models/Register');

/*
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        }

        try {
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser( async (id, done) => {
   
    const user = await User.findById(id);
    if(user) done(null,user)
    else done("id not exist", null)
    
  })
  passport.use(new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user_login = await Register.findOne({ email });
  
        // Check if user exists
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
  
  
    passport.serializeUser((user, done) => {
      done(null, user.id)
    })
  
    passport.deserializeUser( async (id, done) => {
     
      const user = await Register.findById(id);
      if(user) done(null,user)
      else done("id not exist", null)
      
    })
}


*/
module.exports = function (passport) {
  // Google authentication strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        }

        try {
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

1
  // Local authentication strategy
  passport.use(new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user_login = await Register.findOne({ email });

        // Check if user exists
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

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (user) {
        done(null, user);
      } else {
        const user_login = await Register.findById(id);
        if (user_login) {
          done(null, user_login);
        } else {
          done("User not found", null);
          console.log("asdds")
          //req.session.destroy();
        }
      }
    } catch (err) {
      
      console.error(err);
      done(err, null);
    }
  })
}

/*const user = await findById(id);
if(user) done(null,user)
else done("id not exist", null)
*/