import {NextFunction, Request, Response} from "express";
import AppError from "../errors/AppError";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _: NextFunction
): Response => {
    let status: number = 500;
    let message: string = "Internal Server Error";

    if (err instanceof AppError) {
        status = err.status;
        message = err.message;
    } else if (err instanceof Error) {
        status = 400;
        message = err.message;
    }
    if (err.name === "CastError") {
        status = 404;
        message = "Not Found";
    }

    return res.status(status).json({
        error: message,
    });
};
export default errorHandler;
