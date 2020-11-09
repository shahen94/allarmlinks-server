import UnauthorizedRequestError from "../errors/UnauthorizedRequestError";

const jwt = require("jsonwebtoken");

export const getDecoded = (token: string): any => {
    try {
        let decoded = jwt.verify(
            token,
            `${process.env.JWT_SECRET_KEY}`
        );
        return decoded;
    } catch (ignored) {
        throw new UnauthorizedRequestError("Unauthorized!");
    }
};

export const createToken = (id: string): string => {
    return jwt.sign({id}, `${process.env.JWT_SECRET_KEY}`, {
        expiresIn: '1d',
    });
}