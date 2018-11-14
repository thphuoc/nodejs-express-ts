const JwtStrategy = require('passport-jwt').Strategy;
const BearerStrategy = require('passport-http-bearer');
const ExtractJwt  = require('passport-jwt').ExtractJwt;
import { jwtSecret } from './configs/vars';
import * as authProviders from './api/services/authProviders';
import User from './data/collection/User';

const jwtOptions = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwtAuth = async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (user) return done(null, user);
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
};

const oAuth = service => async (token, done) => {
    try {
        const userData = await authProviders[service](token);
        const user = await User.oAuthLogin(userData);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
};

export const jwt = new JwtStrategy(jwtOptions, jwtAuth);
export const facebook = new BearerStrategy(oAuth('facebook'));
export const google = new BearerStrategy(oAuth('google'));
