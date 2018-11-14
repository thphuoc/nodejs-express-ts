import {register, login, refresh, oAuth} from "../../../controller/auth.controller";
import {oAuthLogin} from "../../middlewares/auth";
import * as express from 'express';
import * as validations from '../../../validations/auth.validation'
const validate = require('express-validation');

const authRouter = express.Router();

authRouter.route('/register')
    .put(validate(validations.register), register);

authRouter.route('/login')
    .post(validate(validations.login), login);

authRouter.route('/refresh-token')
    .post(validate(validations.refresh), refresh);

authRouter.route('/facebook')
    .post(validate(validations.oAuth), oAuthLogin('facebook'), oAuth);

authRouter.route('/google')
    .post(validate(validations.oAuth), oAuthLogin('google'), oAuth);

export default authRouter;
