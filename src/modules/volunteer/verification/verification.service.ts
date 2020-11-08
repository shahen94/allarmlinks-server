import AppError from "../../../errors/AppError";
import sgMail from "@sendgrid/mail";
import {updatePhoneVerificationStatus} from "../volunteer.service";

const twilioClient = require("twilio")(
    `${process.env.TWILIO_ACCOUNT_SID}`,
    `${process.env.TWILIO_AUTH_TOKEN}`
);

sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

export const sendSecureCodeToPhone = function (phone: string) {
    return twilioClient.verify
        .services(`${process.env.VERIFICATION_SID}`)
        .verifications.create({to: phone, channel: "sms"});
};

export const sendEmailToken = function (
    email: string,
    name: string,
    token: string
) {
    const msg = {
        to: email,
        from: `${process.env.FROM_EMAIL}`,
        dynamic_template_data: {
            receiverName: name,
            tokenUrl: `${process.env.HEROKU_URL}/verification/email/${token}`,
            subject: "AllArmLinks Confirmation message",
        },
        templateId: "d-f4847c8577064774ace04180a35106cc",
    };

    return sgMail.send(msg);
};

export const verifyVolunteerPhone = function (
    id: string,
    phone: string,
    code: string
) {
    return twilioClient.verify
        .services(`${process.env.VERIFICATION_SID}`)
        .verificationChecks.create({to: `${phone}`, code: `${code}`})
        .then(async (verification_check: any) => {
            console.log(verification_check.status);

            if (verification_check.status === "approved") {
                return updatePhoneVerificationStatus(id, phone);
            } else {
                throw new AppError(400, "Phone can't be verified.");
            }
        });
};


