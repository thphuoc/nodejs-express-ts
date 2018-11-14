"use strict";
exports.__esModule = true;
var Joi = require('joi');
exports.register = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6).max(128)
    }
};
exports.login = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().required().max(128)
    }
};
exports.oAuth = {
    body: {
        access_token: Joi.string().required()
    }
};
exports.refresh = {
    body: {
        email: Joi.string().email().required(),
        refreshToken: Joi.string().required()
    }
};
//# sourceMappingURL=auth.validation.js.map