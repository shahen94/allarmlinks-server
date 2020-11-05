import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";

type Nullable<T> = T | null;


export interface IVolunteer extends Document {
    name: string,
    surname: string,
    email: string,
    phone?: Nullable<string>,
    isMailVerified?: boolean,
    isPhoneVerified?: boolean
}

const VolunteerSchema: Schema = new mongoose.Schema({
    name: String,
    surname: String,
    email: {type: String, trim: true, index: true, unique: true, sparse: true},
    phone: {type: String, trim: true, index: true, unique: true, sparse: true, default: undefined},
    isMailVerified: {type: Boolean, default: false},
    isPhoneVerified: {type: Boolean, default: false},
});

export const Volunteer = mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);