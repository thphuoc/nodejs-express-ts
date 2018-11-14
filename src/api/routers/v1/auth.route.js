"use strict";
exports.__esModule = true;
var auth_controller_1 = require("../../../controller/auth.controller");
var auth_1 = require("../../middlewares/auth");
var express = require("express");
var validations = require("../../../validations/auth.validation");
var validate = require('express-validation');
var authRouter = express.Router();
authRouter.route('/register')
    .put(validate(validations.register), auth_controller_1.register);
authRouter.route('/login')
    .post(validate(validations.login), auth_controller_1.login);
authRouter.route('/refresh-token')
    .post(validate(validations.refresh), auth_controller_1.refresh);
authRouter.route('/facebook')
    .post(validate(validations.oAuth), auth_1.oAuthLogin('facebook'), auth_controller_1.oAuth);
authRouter.route('/google')
    .post(validate(validations.oAuth), auth_1.oAuthLogin('google'), auth_controller_1.oAuth);
exports["default"] = authRouter;
//# sourceMappingURL=auth.route.js.map