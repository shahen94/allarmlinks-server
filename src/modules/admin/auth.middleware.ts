import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import {Admin} from "./admin.model";
import {authRequest} from "./admin.interfaces";
import UnauthorizedRequestError from "../../errors/UnauthorizedRequestError";
import AppError from "../../errors/AppError";

const authorize = (req: authRequest, _: Response, next: NextFunction): void => {
    let token = req.headers["x-access-token"];

    if (!token) {
        throw new UnauthorizedRequestError("No token provided!");
    }

    jwt.verify(
        `${token}`,
        `${process.env.JWT_SECRET_KEY}`,
        (err, decoded: any) => {
            if (err) {
                throw new UnauthorizedRequestError("Unauthorized!");
            }
            Admin.findOne({_id: decoded.id}).then((data) => {
                if (data) req.adminData = data;
                next();
            });
        }
    );
};

const authenticate = (
    req: authRequest,
    _: Response,
    next: NextFunction
): void => {
    if (req.adminData.type === "super") {
        next();
        return;
    }
    throw new AppError(403, "Not super admin!");
};

export const authJwt = {
    authenticate,
    authorize,
};
