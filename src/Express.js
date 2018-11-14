"use strict";
exports.__esModule = true;
var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var compress = require("compression");
var methodOverride = require("method-override");
var cors = require("cors");
var helmet = require("helmet");
var passport = require("passport");
var v1_1 = require("./api/routers/v1");
var vars_1 = require("./configs/vars");
var Authentication_1 = require("./Authentication");
var error_1 = require("./api/middlewares/error");
var app = express();
app.use(morgan(vars_1.logs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());
app.use(passport.initialize());
passport.use('jwt', Authentication_1.jwt);
passport.use('facebook', Authentication_1.facebook);
passport.use('google', Authentication_1.google);
app.use('/v1', v1_1.router);
app.use(error_1.converter);
app.use(error_1.notFound);
app.use(error_1.handler);
exports["default"] = app;
//# sourceMappingURL=Express.js.map