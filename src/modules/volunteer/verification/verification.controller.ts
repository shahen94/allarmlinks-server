import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {
    createVolunteerForRegisterStepOne,
    updateMailVerificationStatus,
    validateVolunteerRegisterDataStepTwo,
} from "../volunteer.service";

import {sendEmailToken, sendSecureCodeToPhone, verifyVolunteerPhone,} from "./verification.service";

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

    const token = jwt.sign(
        {id: volunteer._id},
        `${process.env.JWT_SECRET_KEY}`,
        {
            expiresIn: "1d",
        }
    );

    sendEmailToken(volunteer.email, volunteer.name, token).then(() =>
        res.status(200).json()
    );
};

export const verifyEmailToken = async function (req: Request, res: Response): Promise<void> {
    const decoded: any = jwt.verify(
        req.params.token,
        `${process.env.JWT_SECRET_KEY}`
    );

    updateMailVerificationStatus(decoded.id).then(() =>
        res.status(200).json({
            data: {id: decoded.id},
        })
    );
};

export const registerStepTwo = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const {phone, id} = req.body;
    await validateVolunteerRegisterDataStepTwo({phone, id});

    sendSecureCodeToPhone(phone).then(() => res.status(200).json());
};

export const verifyPhoneCode = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const {phone, id, code} = req.body;
    await validateVolunteerRegisterDataStepTwo({phone, id});

    await verifyVolunteerPhone(id, phone, code).then(() =>
        res.status(200).json()
    );
};
