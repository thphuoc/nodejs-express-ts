import * as crypto from 'crypto';
import * as moment from 'moment-timezone';
import mongoose, {Document, Model, model, Schema} from "mongoose";
import User from './User';

export interface IRefreshToken {
    token?: string,
    userId?: mongoose.Schema.Types.ObjectId,
    userEmail?:string,
    expires?: Date
}

/**
 * Refresh Token Schema
 * @private
 */
const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: 'String',
    ref: 'User',
    required: true,
  },
  expires: { type: Date },
});

refreshTokenSchema.statics.generate = async (user) => {
    const userId = user._id;
    const userEmail = user.email;
    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();
    const tokenObject = new RefreshToken({
        token, userId, userEmail, expires,
    });
    tokenObject.save();
    return tokenObject;
};

/**
 * @typedef RefreshToken
 */
const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);
export default RefreshToken;
