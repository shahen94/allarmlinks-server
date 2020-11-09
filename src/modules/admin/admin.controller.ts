import {Request, Response} from "express";
import {addAdminSchema, loginValidationSchema} from "./validationSchemas";
import adminService from "./admin.service";

export const login = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const {email, password} = req.body;
    await loginValidationSchema.validateAsync({email, password});
    const adminDataWithJwt = await adminService.getDataWithJwt(email, password);
    return res.status(200).json(adminDataWithJwt);
};

export const profile = async (
    _: Request,
    res: Response
): Promise<Response> => {
    const profileData = await adminService.getProfileData();
    return res.status(200).json(profileData);
};

export const addGeneralAdmin = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const {name, surname, email, password} = req.body;
    await addAdminSchema.validateAsync({name, surname, email, password});
    await adminService.errorIfDataExists({email});
    const addedGeneralAdmin = await adminService.createAdminData(
        name,
        surname,
        email,
        password
    );
    return res.status(200).json(addedGeneralAdmin);
};

export const getGeneralAdmins = async (
    _: Request,
    res: Response
): Promise<Response> => {
    const adminsData = await adminService.getGeneralAdmins();
    return res.status(200).json(adminsData);
};

export const editGeneralAdmin = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const editedGeneralAdmin = await adminService.editGeneralAdmin(
        req.params.id,
        req.body
    );
    return res.status(200).json(editedGeneralAdmin);
};

export const deleteGeneralAdmin = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const deletedGeneralAdmin = await adminService.deleteGeneralAdmin(
        req.params.id
    );
    return res.status(200).json(deletedGeneralAdmin);
};

export const getGeneralAdminData = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const generalAdminData = await adminService.getGeneralAdminData(
        req.params.id
    );
    return res.status(200).json(generalAdminData);
};
