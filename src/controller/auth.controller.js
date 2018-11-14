"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var User_1 = require("../data/collection/User");
var httpStatus = require("http-status");
var moment = require("moment-timezone");
var RefreshToken_1 = require("../data/collection/RefreshToken");
var vars_1 = require("../configs/vars");
var generateTokenResponse = function (user, accessToken) {
    var tokenType = 'Bearer';
    var refreshToken = RefreshToken_1["default"].generate(user).token;
    var expiresIn = moment().add(vars_1.jwtExpirationInterval, 'minutes');
    return {
        tokenType: tokenType, accessToken: accessToken, refreshToken: refreshToken, expiresIn: expiresIn
    };
};
exports.register = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var user, userTransformed, token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, (new User_1["default"](req.body)).save()];
            case 1:
                user = _a.sent();
                userTransformed = user.transform();
                token = generateTokenResponse(user, user.token());
                res.status(httpStatus.CREATED);
                return [2, res.json({ token: token, user: __assign({}, userTransformed) })];
            case 2:
                error_1 = _a.sent();
                return [2, next(User_1["default"].checkDuplicateEmail(error_1))];
            case 3: return [2];
        }
    });
}); };
exports.login = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var _a, user, accessToken, token, userTransformed, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4, User_1["default"].findAndGenerateToken(req.body)];
            case 1:
                _a = _b.sent(), user = _a.user, accessToken = _a.accessToken;
                token = generateTokenResponse(user, accessToken);
                userTransformed = user.transform();
                return [2, res.json({ token: token, user: userTransformed })];
            case 2:
                error_2 = _b.sent();
                return [2, next(error_2)];
            case 3: return [2];
        }
    });
}); };
exports.oAuth = function (req, res, next) {
    try {
        var user = req.user;
        var accessToken = user.token();
        var token = generateTokenResponse(user, accessToken);
        var userTransformed = user.transform();
        return res.json({ token: token, user: userTransformed });
    }
    catch (error) {
        return next(error);
    }
};
exports.refresh = function (req, res, next) {
    try {
        var _a = req.body, email = _a.email, refreshToken = _a.refreshToken;
        var refreshObject = RefreshToken_1["default"].findOneAndRemove({
            userEmail: email,
            token: refreshToken
        });
        var _b = User_1["default"].findAndGenerateToken({ email: email, refreshObject: refreshObject }), user = _b.user, accessToken = _b.accessToken;
        var response = generateTokenResponse(user, accessToken);
        return res.json(response);
    }
    catch (error) {
        return next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map