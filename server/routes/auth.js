const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User')

passport.use(new GoogleStrategy({
        clientID: '1059332861444-8e5it7beta73ijr2mv16t5pcfu30gqdm.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:5000/google/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value
    }
    try {
        let user = await User.findOne({googleId: profile.id,})
        if (user) {
            done(null, user)
        } else {
            user = await User.create(newUser);
            done(null, user)
        }
    } catch (error) {
        console.log(error)
    }
    }
));


router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login-failure',
        successRedirect: '/dashboard'
    })
);

router.get('/login-failure', (req, res) => {
    res.send('Something went wrong...')
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error)
            res.send('Error loggin out');
        } else {
            res.redirect('/')
        }
    })
})

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


module.exports = router;