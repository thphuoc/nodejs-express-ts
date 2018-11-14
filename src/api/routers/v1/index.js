"use strict";
exports.__esModule = true;
var express = require("express");
var auth_route_1 = require("./auth.route");
exports.router = express.Router();
exports.router.get('/status', function (req, res) { return res.send('OK'); });
exports.router.use('/docs', express.static('docs'));
exports.router.use('/auth', auth_route_1["default"]);
//# sourceMappingURL=index.js.map