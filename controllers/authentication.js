const jwt = require("jwt-simple");

const User = require("../models/User");
const config = require("../config");

function tokenForUser(user) {
    const timeStamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret)
}

exports.signin = function(req, res, next) {
    res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.status(422).send({ error: "You must provide email and password." });
    }

    User.findOne({ email: email }, (err, existingUser) => {
        if (err) return next(err);

        if(existingUser) {
            return res.status(422).send({ error: "Email already in use"});
        }

        const newUser = new User({
            email: email,
            password: password
        });

        newUser.save((err) => {
            res.json({ token: tokenForUser(newUser) });
        });

    });
}