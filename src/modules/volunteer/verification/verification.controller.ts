import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {
    createVolunteerForRegisterStepOne,
    updateMailVerificationStatus,
    validateVolunteerRegisterDataStepTwo,
} from "../volunteer.service";

import {sendEmailToken, sendSecureCodeToPhone, verifyVolunteerPhone,} from "./verification.service";
import AppError from "../../../errors/AppError";
import {STATUS_EMAIL_VERIFIED, STATUS_FINISHED, STATUS_PHONE_VERIFIED, Volunteer} from "../volunteer.model";

export const registerStepOne = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const {name, surname, email} = req.body;

    const volunteer = await createVolunteerForRegisterStepOne({
        name,
        surname,
        email,
    });

    if (volunteer.status != STATUS_FINISHED) {
        const token = jwt.sign(
            {id: volunteer._id},
            `${process.env.JWT_SECRET_KEY}`,
            {
                expiresIn: "1d",
            }
        );
        await sendEmailToken(volunteer.email, volunteer.name, token);
    }

    res.status(200).json({
        status: volunteer.status
    });
};

export const verifyEmailToken = async function (req: Request, res: Response): Promise<void> {
    const decoded: any = jwt.verify(
        req.params.token,
        `${process.env.JWT_SECRET_KEY}`
    );

    const volunteer = await Volunteer.findById(decoded.id);
    if (!volunteer)
        throw new AppError(400, "Unexpected error");

    let status = volunteer.status;

    if (volunteer.status != STATUS_FINISHED) {
        await updateMailVerificationStatus(decoded.id);
        status = STATUS_EMAIL_VERIFIED;
    }

    res.status(200).json({
        status: status
    });
};

export const registerStepTwo = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const {phone} = req.body;
    const token = req.params.token;

    console.log(token);
    console.log(phone);

    await validateVolunteerRegisterDataStepTwo({phone: phone});

    const decoded: any = jwt.verify(
        token,
        `${process.env.JWT_SECRET_KEY}`
    );

    const volunteer = await Volunteer.findById(decoded.id);
    if (!volunteer)
        throw new AppError(400, "Volunteer not found");

    let tmp = await Volunteer.findOne({phone: phone});
    if (tmp)
        throw new AppError(400, "Phone is already used.");

    if (volunteer.status != STATUS_PHONE_VERIFIED && volunteer.status != STATUS_FINISHED) {
        await sendSecureCodeToPhone(phone);
    }

    res.status(200).json({
        status: volunteer.status
    });
};

export const verifyPhoneCode = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const {phone, code} = req.body;
    const {token} = req.params;
    await validateVolunteerRegisterDataStepTwo({phone: phone});

    const decoded: any = jwt.verify(
        token,
        `${process.env.JWT_SECRET_KEY}`
    );

    const volunteer = await Volunteer.findById(decoded.id);
    if (!volunteer)
        throw new AppError(400, "Volunteer not found");

    let status = volunteer.status;

    let tmp = await Volunteer.findOne({phone: phone});
    if (tmp)
        throw new AppError(400, "Phone is already used.");

    if (status != STATUS_PHONE_VERIFIED && status != STATUS_FINISHED) {
        await verifyVolunteerPhone(decoded.id, phone, code);
        status = STATUS_PHONE_VERIFIED;
    }

    res.status(200).json({
        status: status
    });
};
