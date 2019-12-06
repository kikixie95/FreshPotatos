const bcrypt = require('bcrypt');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const dotenv = require('dotenv');
dotenv.config();

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    const encryptPassword = password => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    };

    const validPassword = (userPassword, password) => {
        return bcrypt.compareSync(password, userPassword);
    };

    passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, (email, password, done) => {
        User.findOne({email: email}).then(user => {
            if (user) {
                console.log("User already exist!");
                return done(null, false, {message: 'User already exist!'});
            } else {
                const encryptedPassword = encryptPassword(password);
                const user = new User({
                    email: email,
                    password: encryptedPassword
                })
                user.save().then(user => {
                    console.log("User created! Signup success!");
                    return done(null, user);
                });
            }
        });
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, (email, password, done) => {
        User.findOne({email: email}).then(user => {
            if (!user) {
                return done(null, false, {message: "Email does not exist!"});
            }
            if (!validPassword(user.password, password)) {
                return done(null, false, {message: "Password does not match"});
            }
            console.log("Login success");
            return done(null, user);
        }).catch(err => {
            console.log(err);
            return done(null, false, {message: 'Something went wrong with signin.'});
        });
    }));

    const dotenv = require('dotenv');
    dotenv.config();
    const opts = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: process.env.SECRET_KEY,
    }

    passport.use('jwt', new JWTStrategy(opts, (jwt_payload, done) => {
        User.findOne({
            email: jwt_payload.email
        }).then(user => {
            if (user) {
                console.log("User authenticated with passport-jwt");
                return done(null, user);
            } else {
                console.log("Authenticate failed");
                return done(null, false);
            }
        }).catch(err => {
            console.log("Something went run on passport jwt");
            return done(err);
        });
    }));
}