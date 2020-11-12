"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.getDecoded = void 0;
var UnauthorizedRequestError_1 = __importDefault(require("../errors/UnauthorizedRequestError"));
var jwt = require("jsonwebtoken");
exports.getDecoded = function (token) {
    try {
        return jwt.verify(token, "" + process.env.JWT_SECRET_KEY);
    }
    catch (ignored) {
        throw new UnauthorizedRequestError_1.default("Unauthorized!");
    }
};
exports.createToken = function (id) {
    return jwt.sign({ id: id }, "" + process.env.JWT_SECRET_KEY, {
        expiresIn: '1d',
    });
};
