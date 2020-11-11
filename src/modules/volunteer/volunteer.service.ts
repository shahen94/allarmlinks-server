import { IVolunteer, STATUS_EMAIL_VERIFIED, STATUS_FINISHED, STATUS_PHONE_VERIFIED, Volunteer, } from "./volunteer.model";
import { VolunteerRegisterStepOneData, VolunteerRegisterStepTwoData, } from "./verification/verification.interfaces";
import AppError from "../../errors/AppError";
import { ClientSession } from "mongoose";
import NotFoundError from "../../errors/NotFoundError";
import { FilterType, IVolunteerFilter } from "../admin/admin.interfaces";
import { getTagsForVolunteer, getVolunteersForTags } from './tags/tags.service';
import { Tag } from "./tags/tags.model";
import { getAllAvailableTagsForVolunteer } from './tags/tags.controller';
const faker = require("faker");

const Joi = require("joi").extend(require("joi-phone-number"));

export const validateVolunteerRegisterDataStepOne = async function (
    data: VolunteerRegisterStepOneData
) {
    await volunteerStepOneDataValidation.validateAsync(data);

    return Volunteer.findOne({ email: data.email });
};

export const volunteerStepOneDataValidation = Joi.object({
    name: Joi.string().alphanum().min(1).required(),
    surname: Joi.string().alphanum().min(1).required(),
    email: Joi.string().email().required(),
});

export const volunteerPhoneValidation = Joi.object({
    phone: Joi.string().phoneNumber(),
});

export const createVolunteerForRegisterStepOne = async function (
    data: VolunteerRegisterStepOneData
) {
    let volunteer = await validateVolunteerRegisterDataStepOne(data);
    if (!volunteer) {
        return await Volunteer.create({
            name: data.name,
            surname: data.surname,
            email: data.email,
        });
    }

    return volunteer;
};

export const validateVolunteerRegisterDataStepTwo = async function (
    data: VolunteerRegisterStepTwoData
): Promise<void> {
    await volunteerPhoneValidation.validateAsync(data);
};

export const updateMailVerificationStatus = function (id: string) {
    return Volunteer.findByIdAndUpdate(
        id,
        { status: STATUS_EMAIL_VERIFIED },
        {
            new: true,
            runValidators: true,
        }
    );
};

export const updatePhoneVerificationStatus = function (
    id: string,
    phone: string
) {
    return Volunteer.findByIdAndUpdate(
        id,
        {
            status: STATUS_PHONE_VERIFIED,
            phone: phone,
        },
        {
            new: true,
            runValidators: true,
        }
    );
};

export const existsVolunteerById = async (
    volunteerId: string
): Promise<boolean> => {
    const volunteer = await Volunteer.findById(volunteerId);
    return !!volunteer;
};

export const validateAdditionalData = async (data: IVolunteer) => {
    const volunteer = await Volunteer.findById(data._id);
    if (!volunteer) throw new AppError(400, "Volunteer doesn't exist");

    if (volunteer.status != STATUS_PHONE_VERIFIED)
        throw new AppError(400, "Invalid status.");

    if (!data.country || !data.city || !data.birthDate)
        throw new AppError(400, "Birth date, country and city fields are required");
};

export const updateWithAdditionalData = async (
    data: IVolunteer,
    session: ClientSession
) => {
    await validateAdditionalData(data);

    return Volunteer.findByIdAndUpdate(
        data._id,
        {
            birthDate: data.birthDate,
            country: data.country,
            city: data.city,
            address: data.address,
            specialization: data.specialization,
            currentEmployerName: data.currentEmployerName,
            occupation: data.occupation,
            languages: data.languages,
            hoursPerWeek: data.hoursPerWeek,
            facebookProfile: data.facebookProfile,
            linkedinProfile: data.linkedinProfile,
            twitterProfile: data.twitterProfile,
            whereToVolunteer: data.whereToVolunteer,
            other: data.other,
            status: STATUS_FINISHED,
        },
        {
            new: true,
            runValidators: true,
            session: session,
        }
    );
};

export const getVolunteers = async (volunteerId: any, limit: number, filter: IVolunteerFilter) => {
    const { value } = filter
    let query;
    if(filter.type){
        switch (filter.type) {
            case FilterType.FullName:
                query = Volunteer.find().byFullName(value)
                break;
            case FilterType.CompanyOccupation:
                query = Volunteer.find().byCompanyOccupation(value)
                break;
            case FilterType.CountryCity:
                query = Volunteer.find().byCountryCity(value)
                break;
            case FilterType.Email:
                query = Volunteer.find().byEmail(value)
                break;
            case FilterType.Language:
                query = Volunteer.find().byLanguage(value)
                break;
            case FilterType.Skills:
                return getVolunteersForTags(value.split(' '))
        }
        return query.sort({ _id: 1 }).limit(limit);
    }else{
        if (volunteerId)
            return Volunteer.find({ _id: { $gt: volunteerId } })
            .sort({ _id: 1 })
            .limit(limit);
        else return Volunteer.find().sort({ _id: 1 }).limit(limit);
    }
};
export const getVolunteersCount = async ()=>{
    return await Volunteer.count({})
}
export const getVolunteer = async (volunteerId: string) => {
    const data = await Volunteer.findById(volunteerId);
    if (!data) {
        throw new NotFoundError("Volunteer not found");
    }
    const skillData = await getTagsForVolunteer(volunteerId)
    const skills = skillData.map(obj=>obj.name)
    return {...data.toObject(),skills};
};

export const createDummyVolunteer = async () => {
    const [name, surname] = faker.name.findName().split(" ");
    const email = faker.internet.email();
    const phone = faker.phone.phoneNumber();

    const volunteer = {
        name: name,
        surname: surname,
        email: email,
        phone: phone,
        city: "Yerevan",
        country: "Armenia",
        status: STATUS_FINISHED,
    };

    return Volunteer.create(volunteer);
};

export const createDummyData = async (limit: number) => {
    for (let i = 0; i < limit; i++) await createDummyVolunteer();
};

// interface  IConditions {
//     [key: stirng] : string
// }
//
// data = Volunteer.find({}));
//
// export const searchByField = async (data:query: IFilterQuery) => {
//     return Volunteer.find({
//         [query.field]: query.exp
//     });
// }
//
// export const filterByFields = async (queries: IFilterQuery[]) => {
//     if (queries.length > 1) {
//         let result = await searchByField(queries[0]);
//         for (let i = 1; i < queries.length; i++)
//             result = await searchByField(result, queries[i]);
//         return result;
//     }
//     return [];
// }
