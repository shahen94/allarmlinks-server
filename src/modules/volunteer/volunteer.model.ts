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
    byFullName(this: DocumentQuery<any, IVolunteer>, fullName: string) {
        const [name1, name2] = fullName.split(' ')

        if (name2)
            return this.where({ $or: [{ name: caseInsExp(name1) }, { surname: caseInsExp(name1) }, { name: caseInsExp(name2) }, { surname: caseInsExp(name2) }] })

        return this.where({ $or: [{ name: caseInsExp(name1) }, { surname: caseInsExp(name1) }] })

    },
    byLanguage(this: DocumentQuery<any, IVolunteer>, languages: string) {
        const query = languages.split(' ').map(lang => {
            return { languages: caseInsExp(lang) }
        })
        return this.where({ $or: query })
    },
    byEmail(this: DocumentQuery<any, IVolunteer>, email: string) {
        return this.where({ email: caseInsExp(email) })
    },
    byCompanyOccupation(this: DocumentQuery<any, IVolunteer>, countryCity: string) {
        const [job1, job2] = countryCity.split(' ')
        if (job2)
            return this.where({ $or: [{ currentEmployerName: caseInsExp(job1) }, { occupation: caseInsExp(job1) }, { currentEmployerName: caseInsExp(job2) }, { occupation: caseInsExp(job2) }] })

        return this.where({ $or: [{ currentEmployerName: caseInsExp(job1) }, { occupation: caseInsExp(job1) }] })
    },
    byCountryCity(this: DocumentQuery<any, IVolunteer>, countryCity: string) {
        const [loc1, loc2] = countryCity.split(' ')
        if (loc2)
            return this.where({ $or: [{ country: caseInsExp(loc1) }, { city: caseInsExp(loc1) }, { country: caseInsExp(loc2) }, { city: caseInsExp(loc2) }] })

        return this.where({ $or: [{ country: caseInsExp(loc1) }, { city: caseInsExp(loc1) }] })
    }
}
VolunteerSchema.query = volunteerQueryHelpers
export const Volunteer = mongoose.model<IVolunteer, IVolunteerModel>("Volunteer", VolunteerSchema);
