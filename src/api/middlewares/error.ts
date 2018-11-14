import * as httpStatus from 'http-status';
import * as expressValidation from 'express-validation';
import APIError from '../../utils/APIError';
import {env} from '../../configs/vars';
import {NextFunction, Request, Response} from 'express';

export const handler = (err?: any, req?: Request, res?: Response, next?: NextFunction): void => {
    const response = {
        code: err.status,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack,
    };

    if (env !== 'development') {
        delete response.stack;
    }

    res.status(err.status);
    res.json(response);
    res.end();
}

export const converter = (err?: any, req?: Request, res?: Response, next?: NextFunction): void => {
    let convertedError = err;

    if (err instanceof expressValidation.ValidationError) {
        convertedError = new APIError('Error validation', err.status, err.stack);
    } else if (!(err instanceof APIError)) {
        convertedError = new APIError(err.message, err.status, err.stack);
    }

    handler(convertedError, req, res);
}

export const notFound = (req ?: Request, res ?: Response, next ?: NextFunction): void => {
    const err = new APIError('Not found');
    return handler(err, req, res);
}
