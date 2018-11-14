import User from "../data/collection/User";
import * as httpStatus from 'http-status';
import * as moment from 'moment-timezone';
import RefreshToken from "../data/collection/RefreshToken";
import {jwtExpirationInterval} from '../configs/vars';
import {NextFunction, Request, Response} from 'express';

const generateTokenResponse = (user, accessToken: string) => {
    const tokenType = 'Bearer';
    const refreshToken = RefreshToken.generate(user).token;
    const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
    return {
        tokenType, accessToken, refreshToken, expiresIn,
    };
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await (new User(req.body)).save();
        const userTransformed = user.transform();
        const token = generateTokenResponse(user, user.token());
        res.status(httpStatus.CREATED);
        return res.json({token, user: {...userTransformed}});
    } catch (error) {
        return next(User.checkDuplicateEmail(error));
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {user, accessToken} = await User.findAndGenerateToken(req.body);
        const token = generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return res.json({token, user: userTransformed});
    } catch (error) {
        return next(error);
    }
}

export const oAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {user} = req;
        const accessToken = user.token();
        const token = generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return res.json({token, user: userTransformed});
    } catch (error) {
        return next(error);
    }
}

export const refresh = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, refreshToken} = req.body;
        const refreshObject = RefreshToken.findOneAndRemove({
            userEmail: email,
            token: refreshToken,
        });
        const {user, accessToken} = User.findAndGenerateToken({email, refreshObject});
        const response = generateTokenResponse(user, accessToken);
        return res.json(response);
    } catch (error) {
        return next(error);
    }
}
