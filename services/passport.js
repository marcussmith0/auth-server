const passport = require("passport");
const Jwtstrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

const User = require("../models/User");
const config = require("../config");

const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

    User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);

        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if (!isMatch) return done(null, false);

            return done(null, user);
        });
    });
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: config.secret
};

const jwtLogin = new Jwtstrategy(jwtOptions, function(payload, done) {

    User.findById(payload.sub, function(err, user) {
        if (err) return done(err, false);

        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);