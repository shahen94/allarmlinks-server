export interface VolunteerRegisterStepOneData {
    name: string,
    surname: string,
    email: string,
    isMailVerified?: boolean,
}

export interface VolunteerRegisterStepTwoData {
    phone: string,
    id: string,
    code?: string,
    isPhoneVerified?: string
}