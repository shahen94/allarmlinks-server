"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
var mongoose = __importStar(require("mongoose"));
var BadRequestError_1 = __importDefault(require("../../errors/BadRequestError"));
var AdminSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: [true, "Name is required"] },
    surname: {
        type: String,
        trim: true,
        required: [true, "Surname is required"],
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    type: {
        type: String,
        required: [true, "Type is required"],
    },
});
AdminSchema.methods.isCorrectPassword = function (password) {
    if (this.password !== password) {
        throw new BadRequestError_1.default("Wrong password");
    }
};
exports.Admin = mongoose.model("Admin", AdminSchema);
