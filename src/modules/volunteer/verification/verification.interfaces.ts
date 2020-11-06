export interface VolunteerRegisterStepOneData {
    name: string,
    surname: string,
    email: string,
    isMailVerified?: boolean,
}

export interface VolunteerRegisterStepTwoData {
    phone: string,
    code?: string,
}