import { Request, Response } from "express";
import { addAdminSchema, loginValidationSchema, noteSchema, workStatusSchema } from "./validationSchemas";
import adminService from "./admin.service";
import { getVolunteer, getVolunteers, updateWithAdditionalData } from "../volunteer/volunteer.service";
import { IVolunteer, Volunteer } from "../volunteer/volunteer.model";
import { getDecoded } from "../../utils/tokenUtils";
import AppError from "../../errors/AppError";

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
    const volunteerList = await getVolunteers(
        req.query.volunteerId,
        parseInt(req?.query?.limit as string, 10)
    );
    return res.status(200).json({ data: volunteerList });
};

export const getVolunteerData = async (req: Request, res: Response) => {
    const volunteerData = await getVolunteer(req.params.id);
    return res.status(200).json({ data: volunteerData });
};

export const updateWorkStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { workStatus } = req.body;
    await workStatusSchema.validateAsync({ workStatus })

    await Volunteer.findByIdAndUpdate(id, { workStatus: workStatus }, {
        new: true,
    })
    res.status(200).end()
}

export const updateNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { note } = req.body;
    await noteSchema.validateAsync({ note })
    await Volunteer.findByIdAndUpdate(id, { note: note }, {
        new: true,
    })
    res.status(200).end()
}

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
    const { _id, name, surname, email, password } = editedGeneralAdmin
    return res.status(200).json({ data: { _id, name, surname, email, password } });
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
    const { _id, name, surname, email, password } = generalAdminData
    return res.status(200).json({ data: { _id, name, surname, email, password } });
};

