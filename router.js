const passportService = require('./services/passport');
const passport = require("passport");

const Authentication = require("./controllers/authentication");

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate("local", { session: false });

module.exports = function(app) {
    app.get('/', requireAuth, function(req, res, next) {
        res.send({ message: "Yo, you logged in successfully" });
    })

    app.post('/signin', requireSignIn, Authentication.signin);

    app.post('/signup', Authentication.signup);
   
}