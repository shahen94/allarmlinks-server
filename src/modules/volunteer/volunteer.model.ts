import * as mongoose from "mongoose";
import { Document, Schema } from "mongoose";

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
    workStatus?: string,
    facebookProfile?: string,
    linkedinProfile?: string,
    twitterProfile?: string,
    whereToVolunteer?: string,
    other?: string,
    notes?: string,
}

const VolunteerSchema: Schema = new mongoose.Schema({
    name: String,
    surname: String,
    email: { type: String, trim: true, index: true, unique: true, sparse: true },
    phone: { type: String, trim: true, index: true, unique: true, sparse: true, default: undefined },
    status: { type: String, default: STATUS_INITIALIZED },
    birthDate: { type: String, default: null },
    country: { type: String, default: null },
    city: { type: String, default: null },
    address: { type: String, default: null },
    specialization: { type: String, default: null },
    currentEmployerName: { type: String, default: null },
    occupation: { type: String, default: null },
    languages: [String],
    hoursPerWeek: {
        from: { type: Number, default: null },
        to: { type: Number, default: null },
    },
    workStatus: { type: String, default: null },
    facebookProfile: { type: String, default: null },
    linkedinProfile: { type: String, default: null },
    twitterProfile: { type: String, default: null },
    whereToVolunteer: { type: String, default: null },
    other: { type: String, default: null },
    notes: { type: String, default: null },
});

export const Volunteer = mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);

export interface IFilterQuery {
    field: string,
    exp: string
}