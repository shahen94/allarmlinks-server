import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";

type Nullable<T> = T | null;

export const STATUS_INITIALIZED = "initialized";
export const STATUS_EMAIL_VERIFIED = "email verified";
export const STATUS_PHONE_VERIFIED = "phone verified";
export const STATUS_FINISHED = "finished";

export interface IVolunteer extends Document {
    name: string,
    surname: string,
    email: string,
    phone?: Nullable<string>,
    status?: string,
    birthDate?: string,
    country?: string,
    city?: string,
    address?: string,
    specialization?: string,
    currentEmployerName?: string,
    occupation?: string,
    languages?: [string],
    hoursPerWeek?: {
        from: Number,
        to: Number,
    },
    facebookProfile?: string,
    linkedinProfile?: string,
    twitterProfile?: string,
    whereToVolunteer?: string,
    other?: string
}

const VolunteerSchema: Schema = new mongoose.Schema({
    name: String,
    surname: String,
    email: {type: String, trim: true, index: true, unique: true, sparse: true},
    phone: {type: String, trim: true, index: true, unique: true, sparse: true, default: undefined},
    status: {type: String, default: STATUS_INITIALIZED},
    birthDate: String,
    country: String,
    city: String,
    address: String,
    specialization: String,
    currentEmployerName: String,
    occupation: String,
    languages: [String],
    hoursPerWeek: {
        from: Number,
        to: Number,
    },
    facebookProfile: String,
    linkedinProfile: String,
    twitterProfile: String,
    whereToVolunteer: String,
    other: String
});

export const Volunteer = mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);

export interface IFilterQuery {
    field: string,
    exp: string
};