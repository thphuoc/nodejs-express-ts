import * as httpStatus from 'http-status'
export default class APIError extends Error {
    status: number;
    constructor(message: string, status: number = httpStatus.INTERNAL_SERVER_ERROR, stack?) {
        super(message);
        this.message = message;
        this.stack = stack;
        this.status = status;
    }
}
