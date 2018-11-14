import {UserRole} from "../../data/collection/User";

import * as httpStatus from 'http-status';
import * as passport from 'passport';
import APIError from '../../utils/APIError';

import {NextFunction, Request, Response} from 'express';

const handleJWT = (req?: Request, res?: Response, next?: NextFunction, roles?: UserRole) => {
    return (err, user, info) => {
        const error = err || info;
        const apiError = new APIError(
            error ? error.message : 'Unauthorized',
            httpStatus.UNAUTHORIZED,
            error ? error.stack : undefined);

        if (error || !user) {
            return next(apiError);
        }

        if (roles === UserRole.ADMIN) {
            if (user.role !== UserRole.ADMIN) {
                apiError.status = httpStatus.FORBIDDEN;
                apiError.message = 'Forbidden';
                return next(apiError);
            }
        }

        req.user = user;

        return next();
    }
}

export const authorize = (roles?: UserRole) => {
    return (req, res, next) =>
        passport.authenticate(
            'jwt', {session: false},
            this.handleJWT(req, res, next, roles),
        )(req, res, next);
}

export const oAuthLogin = (service) => passport.authenticate(service, {session: false});
