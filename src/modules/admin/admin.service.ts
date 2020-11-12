import { Admin } from "./admin.model";
import { AdminFilterType, IAdmin, IAdminFilter } from "./admin.interfaces";
import { createToken } from "../../utils/tokenUtils"
import bcrypt from "bcrypt";
import NotFoundError from "../../errors/NotFoundError";
import BadRequestError from "../../errors/BadRequestError";
import { caseInsExp } from "../../utils/regexp";

class AdminService {
    createAdminData = async (
        name: string,
        surname: string,
        email: string,
        password: string,
        type: string = "general"
    ): Promise<IAdmin> => {
        // const hashedPass = bcrypt.hashSync(password, 10);
        return await Admin.create({ name, surname, email, password, type });
    };

    getDataWithJwt = async (
        loggedEmail: string,
        loggedPassword: string
    ): Promise<{
        adminData: IAdmin;
        accessToken: string;
    }> => {
        const adminData = await this.errorIfDataNotFound(
            { email: loggedEmail },
            false
        );
        adminData.isCorrectPassword(loggedPassword);
        const accessToken = createToken(adminData._id);
        return { adminData, accessToken };
    };

    errorIfDataExists = async (condition: object): Promise<void> => {
        const data = await Admin.findOne(condition);
        if (data)
            throw new BadRequestError(`${Object.keys(condition)[0]} already exists`);
    };

    errorIfDataNotFound = async (
        condition: object,
        get: boolean
    ): Promise<IAdmin> => {
        const data = await Admin.findOne(condition);
        if (!data) {
            if (get)
                throw new NotFoundError(`${Object.keys(condition)[0]} not found`);
            else throw new BadRequestError(`${Object.keys(condition)[0]} not found`);
        }
        return data;
    };

    getGeneralAdmins = async (filter:IAdminFilter): Promise<IAdmin[]> => {
        const  value = caseInsExp(filter.value)
        const condition:any = {
            type:'general',
        }   
        switch (filter.type) {
            case AdminFilterType.Name:
                condition[AdminFilterType.Name] = value
                break;
            case AdminFilterType.Surname:
                condition[AdminFilterType.Surname] = value
                break;
            case AdminFilterType.Email:
                condition[AdminFilterType.Email] = value
                break;
            }

            return Admin.find(condition);
    };

    editGeneralAdmin = async (
        adminId: string,
        editedData: object
    ): Promise<IAdmin> => {
        const data = await Admin.findByIdAndUpdate(adminId, editedData, {
            new: true,
            runValidators: true,
        });
        if (!data) throw new NotFoundError("Admin not found");
        return data;
    };

    deleteGeneralAdmin = async (adminId: string): Promise<void> => {
        const adminToBeDeleted = await Admin.findByIdAndDelete(adminId);
        if (!adminToBeDeleted) throw new NotFoundError("Admin not found");
    };

    getGeneralAdminData = async (adminId: string): Promise<IAdmin> => {
        return await this.errorIfDataNotFound({ _id: adminId }, true);

    };
}

const adminService = new AdminService();
export default adminService;
