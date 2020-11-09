import UnauthorizedRequestError from "../errors/UnauthorizedRequestError";

const jwt = require("jsonwebtoken");

export const getDecoded = (token: string): any => {
    try {
        return jwt.verify(
            token,
            `${process.env.JWT_SECRET_KEY}`
        );

    } catch (ignored) {
        throw new UnauthorizedRequestError("Unauthorized!");
    }
};

export const createToken = (id: string): string => {
    return jwt.sign({_id:id}, `${process.env.JWT_SECRET_KEY}`, {
        expiresIn: '1d',
    });
}