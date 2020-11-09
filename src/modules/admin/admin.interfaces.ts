import {Request} from "express";
import {Document} from "mongoose";

export interface IAdmin extends Document {
    name: string;
    surname: string;
    email: string;
    password: string;
    type: string;

    isCorrectPassword(password: string): void;

    generateJwt(): string;
}

export interface authRequest extends Request {
    adminData: IAdmin;
}
