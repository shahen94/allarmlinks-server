import {Volunteer} from "./volunteer.model";
import {VolunteerRegisterStepOneData, VolunteerRegisterStepTwoData,} from "./verification/verification.interfaces";

import AppError from "../../errors/AppError";

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

const volunteerStepOneDataValidation = Joi.object({
    name: Joi.string().alphanum().min(1).required(),
    surname: Joi.string().alphanum().min(1).required(),
    email: Joi.string().email().required(),
});

const volunteerPhoneValidation = Joi.object({
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
