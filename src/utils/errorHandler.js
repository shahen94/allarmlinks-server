"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AppError_1 = __importDefault(require("../errors/AppError"));
var errorHandler = function (err, req, res, _) {
    var status = 500;
    var message = "Internal Server Error";
    if (err instanceof AppError_1.default) {
        status = err.status;
        message = err.message;
    }
    else if (err instanceof Error) {
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
exports.default = errorHandler;
