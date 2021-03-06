var db                  = require('./models');
var passport            = require('passport');

module.exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
    passport.authenticate('facebook-token')(req, res, next);
	return;
}

module.exports.setUpFBAuth = function(config, passport, FacebookTokenStrategy) {
    passport.use('facebook-token', new FacebookTokenStrategy({
        clientID:       config.facebook.appID,
        clientSecret:   config.facebook.appSecret
    },
    function(accessToken, refreshToken, profile, done) {

        /*
            Perform any extra validations here
        */

        db.db.User.findOrCreate({
            where : {
                'user_id': profile.id,
                'name': profile.name.givenName + ' ' + profile.name.familyName,
                'provider': profile.provider
            }
        })
        .then(function(user) {
            return done(null, user);
        })
        .error(function(err) {
            console.log(err);
            return done(err);
        });
    }));
};