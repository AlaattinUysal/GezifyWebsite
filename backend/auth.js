const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { findOrCreateOAuthUser, findUserByEmail } = require('./database');
require('dotenv').config();

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  const user = findUserByEmail(email);
  done(null, user);
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const user = findOrCreateOAuthUser('google', profile);
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
} else {
  console.warn('⚠️ GOOGLE_CLIENT_ID veya GOOGLE_CLIENT_SECRET eksik. Google Login çalışmayacak.');
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3001/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const user = findOrCreateOAuthUser('facebook', profile);
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
} else {
  console.warn('⚠️ FACEBOOK_APP_ID veya FACEBOOK_APP_SECRET eksik. Facebook Login çalışmayacak.');
}

module.exports = passport;
