import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";

type Nullable<T> = T | null;

export interface IVolunteer extends Document {
    name: string,
    surname: string,
    email: string,
    phone?: Nullable<string>,
    isMailVerified?: boolean,
    isPhoneVerified?: boolean,
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
    isMailVerified: {type: Boolean, default: false},
    isPhoneVerified: {type: Boolean, default: false},
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