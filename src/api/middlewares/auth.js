"use strict";
var _this = this;
exports.__esModule = true;
var User_1 = require("../../data/collection/User");
var httpStatus = require("http-status");
var passport = require("passport");
var APIError_1 = require("../../utils/APIError");
var handleJWT = function (req, res, next, roles) {
    return function (err, user, info) {
        var error = err || info;
        var apiError = new APIError_1["default"](error ? error.message : 'Unauthorized', httpStatus.UNAUTHORIZED, error ? error.stack : undefined);
        if (error || !user) {
            return next(apiError);
        }
        if (roles === User_1.UserRole.ADMIN) {
            if (user.role !== User_1.UserRole.ADMIN) {
                apiError.status = httpStatus.FORBIDDEN;
                apiError.message = 'Forbidden';
                return next(apiError);
            }
        }
        req.user = user;
        return next();
    };
};
exports.authorize = function (roles) {
    return function (req, res, next) {
        return passport.authenticate('jwt', { session: false }, _this.handleJWT(req, res, next, roles))(req, res, next);
    };
};
exports.oAuthLogin = function (service) { return passport.authenticate(service, { session: false }); };
//# sourceMappingURL=auth.js.map