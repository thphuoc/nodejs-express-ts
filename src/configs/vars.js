"use strict";
exports.__esModule = true;
var path = require("path");
var envLoader = require("dotenv-safe");
console.log('path: ' + path.join(__dirname, '../../.env'));
envLoader.load({
    path: path.join(__dirname, '../../.env'),
    sample: path.join(__dirname, '../../.env.example')
});
exports.mongo = {
    uri: process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI
};
exports.env = process.env.NODE_ENV;
exports.port = process.env.PORT;
exports.jwtSecret = process.env.JWT_SECRET;
exports.jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES;
exports.logs = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
//# sourceMappingURL=vars.js.map