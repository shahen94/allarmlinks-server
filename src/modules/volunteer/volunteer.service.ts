import {IVolunteer, Volunteer} from "./volunteer.model";
import {VolunteerRegisterStepOneData, VolunteerRegisterStepTwoData,} from "./verification/verification.interfaces";
import AppError from "../../errors/AppError";
import {ClientSession} from "mongoose";

const faker = require("faker");

const Joi = require("joi").extend(require("joi-phone-number"));

export const validateVolunteerRegisterDataStepOne = async function (
    data: VolunteerRegisterStepOneData
) {
    await volunteerStepOneDataValidation.validateAsync(data);

    let volunteer = await Volunteer.findOne({email: data.email});
    if (volunteer && volunteer.isMailVerified) {
        throw new AppError(400, "Email is already used.");
    }

    return volunteer;
};

export const volunteerStepOneDataValidation = Joi.object({
    name: Joi.string().alphanum().min(1).required(),
    surname: Joi.string().alphanum().min(1).required(),
    email: Joi.string().email().required(),
});

export const volunteerPhoneValidation = Joi.object({
    phone: Joi.string().phoneNumber(),
    id: Joi.string(),
});

export const createVolunteerForRegisterStepOne = async function (
    data: VolunteerRegisterStepOneData
) {
    let volunteer = await validateVolunteerRegisterDataStepOne(data);
    if (!volunteer) {
        volunteer = await Volunteer.create({
            name: data.name,
            surname: data.surname,
            email: data.email,
        });
    }

    return volunteer;
};

export const checkIfVolunteerEmailVerifiedById = async function (
    id: string
): Promise<boolean> {
    const volunteer = await Volunteer.findById(id);
    return !!(volunteer && volunteer.isMailVerified);
};

export const validateVolunteerRegisterDataStepTwo = async function (
    data: VolunteerRegisterStepTwoData
): Promise<void> {
    await volunteerPhoneValidation.validateAsync(data);

    if (data && data.isPhoneVerified) {
        throw new AppError(400, "Phone is already used.");
    }

    if (!(await checkIfVolunteerEmailVerifiedById(data.id))) {
        throw new AppError(400, "Email is not verified.");
    }
};

export const updateMailVerificationStatus = function (id: string) {
    return Volunteer.findByIdAndUpdate(
        id,
        {isMailVerified: true},
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
            isPhoneVerified: true,
            phone: phone,
        },
        {
            new: true,
            runValidators: true,
        }
    );
};

export const existsVolunteerById = async (volunteerId: string): Promise<boolean> => {
    const volunteer = await Volunteer.findById(volunteerId);
    return !!volunteer;
}

export const validateAdditionalData = async (data: IVolunteer) => {
    const volunteer = await Volunteer.findById(data._id);
    if (!volunteer)
        throw new AppError(400, "Volunteer doesn't exist");

    if (!data.country || !data.city)
        throw new AppError(400, "Country and City fields are required");

    await volunteerStepOneDataValidation.validateAsync({name: data.name, surname: data.surname, email: data.email});

    if (!data.phone)
        throw new AppError(400, "Phone is not valid.");

    await volunteerPhoneValidation.validateAsync({phone: data.phone, id: data._id});

    if (volunteer._id != data._id || volunteer.email != data.email || volunteer.name != data.name
        || volunteer.surname != data.surname || volunteer.phone != data.phone)
        throw new AppError(400, "Incorrect data provided.");
};

export const updateWithAdditionalData = async (data: IVolunteer, session: ClientSession) => {
    await validateAdditionalData(data);

    return Volunteer.findByIdAndUpdate(data._id, {
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
        other: data.other
    }, {
        new: true,
        runValidators: true,
        session: session
    });
};

export const getVolunteers = async (volunteerId: string, limit: number) => {
    if (volunteerId)
        return Volunteer.find({'_id': {'$gt': volunteerId}}).sort({'_id': 1}).limit(limit);
    else
        return Volunteer.find({}).sort({'_id': 1}).limit(limit);
}

export const createDummyVolunteer = async () => {
    const [name, surname] = faker.name.findName().split(" ");
    const email = faker.internet.email();
    const phone = faker.phone.phoneNumber();

    const volunteer = {
        "isMailVerified": true,
        "isPhoneVerified": true,
        "name": name,
        "surname": surname,
        "email": email,
        "phone": phone,
        "city": "Yerevan",
        "country": "Armenia",
    };

    return Volunteer.create(volunteer);
}

export const createDummyData = async (limit: number) => {
    for (let i = 0; i < limit; i++)
        await createDummyVolunteer();
}
