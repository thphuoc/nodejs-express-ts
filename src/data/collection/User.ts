import * as mongoose from "mongoose";
import * as moment from 'moment-timezone';
import * as jwt from 'jwt-simple';
import {env, jwtExpirationInterval, jwtSecret} from "../../configs/vars";
import APIError from "../../utils/APIError";
import {isNil, omitBy} from 'lodash';
import {compare, hashSync} from "bcryptjs";
import * as httpStatus from 'http-status';

import uuidv4 from 'uuid/v4';

export enum UserRole {
    ADMIN = 'ADMIN', LOGIN_USER = 'LOGIN_USER'
}
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128,
    },
    name: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    services: {
        facebook: String,
        google: String,
    },
    role: {
        type: UserRole,
        default: UserRole.LOGIN_USER,
    },
    picture: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('password')) return next();

        const rounds = env === 'test' ? 1 : 10;

        this.password = await hashSync(this.password, rounds);

        return next();
    } catch (error) {
        return next(error);
    }
});

/**
 * Methods
 */
userSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },

    token() {
        const playload = {
            exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
            iat: moment().unix(),
            sub: this._id,
        };
        return jwt.encode(playload, jwtSecret);
    },

    async passwordMatches(password) {
        return compare(password, this.password);
    },
});

/**
 * Statics
 */
userSchema.statics = {
    /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
        try {
            let user;

            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec();
            }
            if (user) {
                return user;
            }

            throw new APIError('User does not exist', httpStatus.NOT_FOUND);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async findAndGenerateToken(options) {
        const { email, password, refreshObject } = options;
        if (!email) throw new APIError('An email is required to generate a token');

        const user = await this.findOne({ email }).exec();
        if (password) {
            if (user && await user.passwordMatches(password)) {
                return { user, accessToken: user.token() };
            }
            throw new APIError('Incorrect email or password', httpStatus.UNAUTHORIZED);
        } else if (refreshObject && refreshObject.userEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                throw new APIError('Invalid refresh token.', httpStatus.UNAUTHORIZED);
            } else {
                return { user, accessToken: user.token() };
            }
        } else {
            throw new APIError('Incorrect email or refreshToken', httpStatus.UNAUTHORIZED);
        }
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({
             page = 1, perPage = 30, name, email, role,
         }) {
        const options = omitBy({ name, email, role }, isNil);

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    /**
     * Return new validation error
     * if error is a mongoose duplicate key error
     *
     * @param {Error} error
     * @returns {Error|APIError}
     */
    checkDuplicateEmail(error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return new APIError('Validation Error');
        }
        return error;
    },

    async oAuthLogin({
                         service, id, email, name, picture,
                     }) {
        const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
        if (user) {
            user.services[service] = id;
            if (!user.name) user.name = name;
            if (!user.picture) user.picture = picture;
            return user.save();
        }
        const password = uuidv4();
        return this.create({
            services: { [service]: id }, email, password, name, picture,
        });
    },
};

/**
 * @typedef User
 */
const User = mongoose.model<any>('User', userSchema);
export default User;
