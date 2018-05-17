import { User } from './../models/user';
const config  = require('../config/config');

import {Passport} from 'passport';

import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
let LocalStrategy = require('passport-local').Strategy;
import * as passportLocal from "passport-local";

const localOptions = { 
        usernameField: 'email',
        passwordField : 'password',
        passReqToCallback : true 
    }; 

export function setupStrategies(passport: Passport):void {

    // ====================== //
    // passport session setup //
    // ====================== //
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user: any, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // ============ //
    // LOCAL SIGNUP //
    // ============ //

    const jwtOptions = {  
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secretKey
    };

    // Setting up JWT login strategy
    const jwt = new JwtStrategy(jwtOptions, (payload, done) => {  
        User.findById(payload.id, function(err, user) {
            if (err) { return done(err, false); }
                if (user) {
                     if(payload.exp < Math.floor(Date.now() / 1000))
                        { 
                            return done(null, false, 'Token has expired!');
                        }
                    done(null, user);
                } else {
                    done(null, false);
                }
        });
    });

    // Setting up local login strategy
    const localLogin = new LocalStrategy(localOptions, function(email, password, done) {  
     console.log("$################### = "+email);
        User.findOne({ email: email }, function(err, user) {
            if(err) { return done(err); }
            if(!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

            user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false, { error: "Your login details could not be verified. Please try again." }); }
                return done(null, user);
            });
        });
    });
    passport.use(jwt);  
    passport.use(localLogin); 
    
};
