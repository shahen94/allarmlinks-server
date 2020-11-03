import {NextFunction, Request, Response} from "express";
import AppError from "../errors/AppError";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status: number = 500;
    let message: string = "Internal Server Error";

    if (err instanceof AppError) {
        status = err.status;
        message = err.message;
    }

    res.status(status).json({
        success: false,
        error: message,
    });
};
export default errorHandler;
