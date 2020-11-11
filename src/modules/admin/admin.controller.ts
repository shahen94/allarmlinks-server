import { Request, Response } from "express";
import { addAdminSchema, loginValidationSchema } from "./validationSchemas";
import adminService from "./admin.service";
import { getVolunteer, getVolunteers } from "../volunteer/volunteer.service";
import { IVolunteerFilter } from "./admin.interfaces";

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    await loginValidationSchema.validateAsync({ email, password });
    const adminDataWithJwt = await adminService.getDataWithJwt(email, password);
    const { name, surname, type } = adminDataWithJwt.adminData;
    return res.status(200).json({
        data: { name, surname, type },
        accessToken: adminDataWithJwt.accessToken,
    });
};

export const getVolunteersList = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const volunteerId: string = req.query.volunteerId as unknown as string
    const filter: IVolunteerFilter = {
         type: req.query.type as unknown ,
         value:req.query.value as unknown
    } as IVolunteerFilter
    const limit: number = req.query.limit as unknown as number
    const volunteerList = await getVolunteers(
        volunteerId,
        limit,
        filter
    );
    return res.status(200).json({ data: volunteerList });
};

export const getVolunteerData = async (req: Request, res: Response) => {
    const volunteerData = await getVolunteer(req.params.id);
    return res.status(200).json({ data: volunteerData });
};

export const addGeneralAdmin = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { name, surname, email, password } = req.body;
    await addAdminSchema.validateAsync({ name, surname, email, password });
    await adminService.errorIfDataExists({ email });
    const newAdmin = await adminService.createAdminData(
        name,
        surname,
        email,
        password
    );
    return res.status(200).json({ data: newAdmin });
};

export const getGeneralAdmins = async (
    _: Request,
    res: Response
): Promise<Response> => {
    const adminsData = await adminService.getGeneralAdmins();
    return res.status(200).json({ data: adminsData });
};

export const editGeneralAdmin = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const editedGeneralAdmin = await adminService.editGeneralAdmin(
        req.params.id,
        req.body
    );
    const { _id, name, surname, email } = editedGeneralAdmin
    return res.status(200).json({ data: { _id, name, surname, email } });
};

export const deleteGeneralAdmin = async (
    req: Request,
    res: Response
): Promise<Response> => {
    await adminService.deleteGeneralAdmin(req.params.id);
    return res.status(200).json({ id: req.params.id });
};

export const getGeneralAdminData = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const generalAdminData = await adminService.getGeneralAdminData(
        req.params.id
    );
    const { _id, name, surname, email } = generalAdminData
    return res.status(200).json({ data: { _id, name, surname, email } });
};
