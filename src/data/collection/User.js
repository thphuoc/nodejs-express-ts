"use strict";
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
exports.__esModule = true;
var mongoose = require("mongoose");
var moment = require("moment-timezone");
var jwt = require("jwt-simple");
var vars_1 = require("../../configs/vars");
var APIError_1 = require("../../utils/APIError");
var lodash_1 = require("lodash");
var bcryptjs_1 = require("bcryptjs");
var httpStatus = require("http-status");
var v4_1 = require("uuid/v4");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["LOGIN_USER"] = "LOGIN_USER";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
    },
    name: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true
    },
    services: {
        facebook: String,
        google: String
    },
    role: {
        type: UserRole,
        "default": UserRole.LOGIN_USER
    },
    picture: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
userSchema.pre('save', function save(next) {
    return __awaiter(this, void 0, void 0, function () {
        var rounds, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!this.isModified('password'))
                        return [2, next()];
                    rounds = vars_1.env === 'test' ? 1 : 10;
                    _a = this;
                    return [4, bcryptjs_1.hashSync(this.password, rounds)];
                case 1:
                    _a.password = _b.sent();
                    return [2, next()];
                case 2:
                    error_1 = _b.sent();
                    return [2, next(error_1)];
                case 3: return [2];
            }
        });
    });
});
userSchema.method({
    transform: function () {
        var _this = this;
        var transformed = {};
        var fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];
        fields.forEach(function (field) {
            transformed[field] = _this[field];
        });
        return transformed;
    },
    token: function () {
        var playload = {
            exp: moment().add(vars_1.jwtExpirationInterval, 'minutes').unix(),
            iat: moment().unix(),
            sub: this._id
        };
        return jwt.encode(playload, vars_1.jwtSecret);
    },
    passwordMatches: function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, bcryptjs_1.compare(password, this.password)];
            });
        });
    }
});
userSchema.statics = {
    get: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        user = void 0;
                        if (!mongoose.Types.ObjectId.isValid(id)) return [3, 2];
                        return [4, this.findById(id).exec()];
                    case 1:
                        user = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (user) {
                            return [2, user];
                        }
                        throw new APIError_1["default"]('User does not exist', httpStatus.NOT_FOUND);
                    case 3:
                        error_2 = _a.sent();
                        throw error_2;
                    case 4: return [2];
                }
            });
        });
    },
    findAndGenerateToken: function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, refreshObject, user, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        email = options.email, password = options.password, refreshObject = options.refreshObject;
                        if (!email)
                            throw new APIError_1["default"]('An email is required to generate a token');
                        return [4, this.findOne({ email: email }).exec()];
                    case 1:
                        user = _b.sent();
                        if (!password) return [3, 4];
                        _a = user;
                        if (!_a) return [3, 3];
                        return [4, user.passwordMatches(password)];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        if (_a) {
                            return [2, { user: user, accessToken: user.token() }];
                        }
                        throw new APIError_1["default"]('Incorrect email or password', httpStatus.UNAUTHORIZED);
                    case 4:
                        if (refreshObject && refreshObject.userEmail === email) {
                            if (moment(refreshObject.expires).isBefore()) {
                                throw new APIError_1["default"]('Invalid refresh token.', httpStatus.UNAUTHORIZED);
                            }
                            else {
                                return [2, { user: user, accessToken: user.token() }];
                            }
                        }
                        else {
                            throw new APIError_1["default"]('Incorrect email or refreshToken', httpStatus.UNAUTHORIZED);
                        }
                        _b.label = 5;
                    case 5: return [2];
                }
            });
        });
    },
    list: function (_a) {
        var _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.perPage, perPage = _c === void 0 ? 30 : _c, name = _a.name, email = _a.email, role = _a.role;
        var options = lodash_1.omitBy({ name: name, email: email, role: role }, lodash_1.isNil);
        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },
    checkDuplicateEmail: function (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return new APIError_1["default"]('Validation Error');
        }
        return error;
    },
    oAuthLogin: function (_a) {
        var service = _a.service, id = _a.id, email = _a.email, name = _a.name, picture = _a.picture;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, user, password;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, this.findOne({ $or: [(_b = {}, _b["services." + service] = id, _b), { email: email }] })];
                    case 1:
                        user = _d.sent();
                        if (user) {
                            user.services[service] = id;
                            if (!user.name)
                                user.name = name;
                            if (!user.picture)
                                user.picture = picture;
                            return [2, user.save()];
                        }
                        password = v4_1["default"]();
                        return [2, this.create({
                                services: (_c = {}, _c[service] = id, _c), email: email, password: password, name: name, picture: picture
                            })];
                }
            });
        });
    }
};
var User = mongoose.model('User', userSchema);
exports["default"] = User;
//# sourceMappingURL=User.js.map