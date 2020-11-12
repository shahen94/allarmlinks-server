import { Request } from "express";
import { Document } from "mongoose";

export interface IAdmin extends Document {
    name: string;
    surname: string;
    email: string;
    password: string;
    type: string;

    isCorrectPassword(password: string): void;

    generateJwt(): string;
}

export interface authRequest extends Request {
    adminData: IAdmin;
}


export enum FilterType {
    FullName = "fullName",
    CompanyOccupation = "companyOccupation",
    CountryCity = "countryCity",
    Email = "email",
    Language = "language",
    Skills = "skills"
}
export interface IVolunteerFilter {
    type: FilterType,
    value: string
}

export enum AdminFilterType {
    Name = "name",
    Surname = "surname",
    Email = "email"
}
export interface IAdminFilter {
    type: AdminFilterType,
    value: string
}