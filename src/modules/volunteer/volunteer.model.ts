import mongoose, { DocumentQuery, Model } from "mongoose";
import { Document, Schema } from "mongoose";
import { caseInsExp } from '../../utils/regexp'
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
    note?: string,
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
    note: { type: String, default: null },
});
interface IVolunteerModel extends Model<IVolunteer, typeof volunteerQueryHelpers> {
    byFullName(): Promise<any>;
}

const volunteerQueryHelpers = {
    byFullName(this: DocumentQuery<any, IVolunteer>, fullName: string, volunteerId: string = '') {
        const [name1, name2] = fullName.split(' ');
        let query: any;
        if (name2)
            query = {
                $and: [
                    { name: caseInsExp(name1) },
                    { surname: caseInsExp(name2) },
                    { status: STATUS_FINISHED }
                ]
            }
        else
            query = {
                $and: [
                    { $or: [{ name: caseInsExp(name1) }, { surname: caseInsExp(name1) }] },
                    { status: STATUS_FINISHED },
                ]

            }
        if (volunteerId) {
            query.$and.push(
                {
                    _id: { $gt: volunteerId }
                }
            )
        }
        return this.where(query)
    },
    byLanguage(this: DocumentQuery<any, IVolunteer>, languages: string, volunteerId: string = '') {
        const langs = languages.split(' ').map(lang => {
            return { languages: caseInsExp(lang) }
        })
        let query: any = {
            $and: [
                {
                    $or: langs
                }
            ]
        }
        if (volunteerId) {
            query.$and.push(
                {
                    _id: { $gt: volunteerId }
                }
            )
        }
        query.$and.push(
            { status: STATUS_FINISHED }
        )
        return this.where({ $or: query })
    },
    byEmail(this: DocumentQuery<any, IVolunteer>, email: string, volunteerId: string = '') {
        let query: any = {
            $and: [
                { email: /.*email.*/ },
                { status: STATUS_FINISHED }
            ]
        }
        if (volunteerId) {
            query.$and.push(
                {
                    _id: { $gt: volunteerId }
                }
            )
        }
        return this.where(query);
    },
    byCompanyOccupation(this: DocumentQuery<any, IVolunteer>, companyOccupation: string, volunteerId: string = '') {
        let query: any;
        query = { $and: [{ $or: [{ currentEmployerName: caseInsExp(companyOccupation) }, { occupation: caseInsExp(companyOccupation) }] }] };
        if (volunteerId) {
            query.$and.push(
                {
                    _id: { $gt: volunteerId }
                },
                { status: STATUS_FINISHED }

            )
        }
        return this.where(query);
    },
    byCountryCity(this: DocumentQuery<any, IVolunteer>, countryCity: string, volunteerId: string = '') {
        let query: any;
        query = { $and: [{ $or: [{ country: caseInsExp(countryCity) }, { city: caseInsExp(countryCity) }] }] };
        if (volunteerId) {
            query.$and.push(
                {
                    _id: { $gt: volunteerId }
                }
            )
        }
        query.$and.push(
            { status: STATUS_FINISHED }
        )
        return this.where(query);
    }
}
VolunteerSchema.query = volunteerQueryHelpers;
export const Volunteer = mongoose.model<IVolunteer, IVolunteerModel>("Volunteer", VolunteerSchema);
