import AppError from "./AppError";

class EmailAlreadyVerifiedError extends AppError {
    constructor(status: number, message: string) {
        super(400, message);
        Object.setPrototypeOf(this, EmailAlreadyVerifiedError.prototype);
    }
}

export default EmailAlreadyVerifiedError;
