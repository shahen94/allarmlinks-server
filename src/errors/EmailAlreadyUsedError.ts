import AppError from "./AppError";

class EmailAlreadyUsedError extends AppError {
    constructor(status: number, message: string) {
        super(400, message);
        Object.setPrototypeOf(this, EmailAlreadyUsedError.prototype);
    }
}

export default EmailAlreadyUsedError;
