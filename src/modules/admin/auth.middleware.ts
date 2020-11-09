import {NextFunction, Response} from "express";
import {Admin} from "./admin.model";
import {authRequest} from "./admin.interfaces";
import UnauthorizedRequestError from "../../errors/UnauthorizedRequestError";
import AppError from "../../errors/AppError";
import {getDecoded} from "../../utils/tokenUtils";

const authorize = async (req: authRequest, _: Response, next: NextFunction): Promise<void> => {
    let token = req.headers["x-access-token"];

    if (!token) {
        throw new UnauthorizedRequestError("No token provided!");
    }

    const decoded = getDecoded(`${token}`);
    const data = await Admin.findOne({_id: decoded.id})
    if (!data) {
        throw new UnauthorizedRequestError("Unauthorized!");
    }
    req.adminData = data;
    next();
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
