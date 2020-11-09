import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import BadRequestError from "../../errors/BadRequestError";
import bcrypt from "bcrypt";
import {IAdmin} from "./admin.interfaces";

const AdminSchema: Schema = new mongoose.Schema({
    name: {type: String, trim: true, required: [true, "Name is required"]},
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

AdminSchema.methods.isCorrectPassword = function (password: string): void {
    if (!bcrypt.compareSync(password, this.password)) {
        throw new BadRequestError("Wrong password");
    }
};

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
