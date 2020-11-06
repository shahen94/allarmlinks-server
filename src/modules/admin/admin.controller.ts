import { Request, Response } from "express";
import {
  adminLoginValidationSchema,
  addAdminSchema,
} from "./validationSchemas";
import adminService from "./admin.service";

export const login = async (req: Request, res: Response) => {
  await adminLoginValidationSchema.validateAsync(req.body);
  const { email, password } = req.body;
  const adminDataWithJwt = await adminService.getAdminDataWithJwt(
    email,
    password
  );
  return res.status(200).json(adminDataWithJwt);
};

export const profile = async (req: Request, res: Response) => {
  const data = await adminService.getProfileData();
  return res.status(200).json(data);
};

export const addGeneralAdmin = async (req: Request, res: Response) => {
  await addAdminSchema.validateAsync(req.body);
  const { name, surname, email, password } = req.body;
  await adminService.checkIfExists(email);
  const newAdmin = await adminService.createAdminData(
    name,
    surname,
    email,
    password,
    "general"
  );
  res.status(200).json({ data: newAdmin });
};

export const gettingAdmins = async (req: Request, res: Response) => {
  const admins = await adminService.getAllAdminsData();
  res.status(200).json({ data: admins });
};

export const editingAdmin = async (req: Request, res: Response) => {
  const editedAdmin = await adminService.editAdminData(req.params.id, req.body);
  res.status(200).json({ data: editedAdmin });
};

export const deletingAdmin = async (req: Request, res: Response) => {
  await adminService.deleteAdmin(req.params.id);
  res.status(200).json({ message: "deleted" });
};

export const gettingDataAdmin = async (req: Request, res: Response) => {
  const data = await adminService.getAdminData(req.params.id);
  res.status(200).json({ data });
};
