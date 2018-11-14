"use strict";
exports.__esModule = true;
var httpStatus = require("http-status");
var expressValidation = require("express-validation");
var APIError_1 = require("../../utils/APIError");
var vars_1 = require("../../configs/vars");
exports.handler = function (err, req, res, next) {
    var response = {
        code: err.status,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack
    };
    if (vars_1.env !== 'development') {
        delete response.stack;
    }
    res.status(err.status);
    res.json(response);
    res.end();
};
exports.converter = function (err, req, res, next) {
    var convertedError = err;
    if (err instanceof expressValidation.ValidationError) {
        convertedError = new APIError_1["default"]('Error validation', err.status, err.stack);
    }
    else if (!(err instanceof APIError_1["default"])) {
        convertedError = new APIError_1["default"](err.message, err.status, err.stack);
    }
    exports.handler(convertedError, req, res);
};
exports.notFound = function (req, res, next) {
    var err = new APIError_1["default"]('Not found');
    return exports.handler(err, req, res);
};
//# sourceMappingURL=error.js.map