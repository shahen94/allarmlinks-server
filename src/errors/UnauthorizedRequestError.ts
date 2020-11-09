import AppError from "./AppError";

class UnauthorizedRequestError extends AppError {
    constructor(message: string) {
        super(401, message);
        Object.setPrototypeOf(this, UnauthorizedRequestError.prototype);
    }
}

export default UnauthorizedRequestError;
