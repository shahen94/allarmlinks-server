import { Admin } from "./admin.model";
import bcrypt from "bcrypt";
import NotFoundError from "../../errors/NotFoundError";
import BadRequestError from "../../errors/BadRequestError";

class AdminService {
  createAdminData = (
    name: string,
    surname: string,
    email: string,
    password: string,
    type: string
  ) => {
    const hashedPass = bcrypt.hashSync(password, 10);
    return Admin.create({ name, surname, email, password: hashedPass, type });
  };

  removeSuperAdminData = () => {
    return Admin.deleteOne({ type: "super" });
  };

  getAdminDataWithJwt = async (email: string, password: string) => {
    const adminData = await Admin.findOne({ email });
    if (!adminData) throw new NotFoundError("Admin not found");
    adminData.isCorrectPassword(password);
    const jwtToken = adminData.generateJwt();
    return { data: adminData, accessToken: jwtToken };
  };

  checkIfExists = async (email: string) => {
    const data = await Admin.findOne({ email });
    if (data) throw new BadRequestError("Email already exists");
  };

  getProfileData = () => {
    // getting volunteers data and sending the type
  };

  getAllAdminsData = async () => {
    return await Admin.find({ type: "general" });
  };

  editAdminData = async (adminId: string, editedData: any) => {
    const adminToBeEdited = await Admin.findByIdAndUpdate(adminId, editedData, {
      new: true,
      runValidators: true,
    });
    if (!adminToBeEdited) throw new NotFoundError("Admin not found");
    return adminToBeEdited;
  };

  deleteAdmin = async (adminId: string) => {
    const adminToBeDeleted = await Admin.findByIdAndDelete(adminId);
    if (!adminToBeDeleted) throw new NotFoundError("Admin not found");
  };

  getAdminData = async (adminId: string) => {
    return await Admin.findOne({ _id: adminId });
  };
}

const adminService = new AdminService();
export default adminService;
