import {Admin} from "./admin.model";
import {IAdmin} from "./admin.interfaces";
import bcrypt from "bcrypt";
import NotFoundError from "../../errors/NotFoundError";
import BadRequestError from "../../errors/BadRequestError";

class AdminService {
    createAdminData = async (
        name: string,
        surname: string,
        email: string,
        password: string,
        type: string = "general"
    ): Promise<{ message: string }> => {
        const hashedPass = bcrypt.hashSync(password, 10);
        await Admin.create({name, surname, email, password: hashedPass, type});
        return {message: "Added!"};
    };

    getDataWithJwt = async (
        loggedEmail: string,
        loggedPassword: string
    ): Promise<{
        data: {
            name: string;
            surname: string;
            email: string;
            type: string;
        };
        accessToken: string;
    }> => {
        const adminData = await this.errorIfDataNotFound({email: loggedEmail});
        adminData.isCorrectPassword(loggedPassword);
        const accessToken = adminData.generateJwt();
        const {name, surname, email, type} = adminData;
        return {data: {name, surname, email, type}, accessToken};
    };

    errorIfDataExists = async (condition: object): Promise<void> => {
        const data = await Admin.findOne(condition);
        if (data)
            throw new BadRequestError(`${Object.keys(condition)[0]} already exists`);
    };

    errorIfDataNotFound = async (condition: object): Promise<IAdmin> => {
        const data = await Admin.findOne(condition);
        if (!data)
            throw new NotFoundError(`${Object.keys(condition)[0]} not found`);
        return data;
    };

    getProfileData = () => {
        // getting volunteers data and sending the type
        return {data: {}};
    };

    getGeneralAdmins = async (): Promise<{ data: IAdmin[] }> => {
        const data = await Admin.find({type: "general"});
        return {data};
    };

    editGeneralAdmin = async (
        adminId: string,
        editedData: object
    ): Promise<{
        data: IAdmin;
    }> => {
        const data = await Admin.findByIdAndUpdate(adminId, editedData, {
            new: true,
            runValidators: true,
        });
        if (!data) throw new NotFoundError("Admin not found");
        return {data};
    };

    deleteGeneralAdmin = async (
        adminId: string
    ): Promise<{
        message: string;
    }> => {
        const adminToBeDeleted = await Admin.findByIdAndDelete(adminId);
        if (!adminToBeDeleted) throw new NotFoundError("Admin not found");
        return {message: "Deleted!"};
    };

    getGeneralAdminData = async (
        adminId: string
    ): Promise<{
        data: IAdmin;
    }> => {
        const data = await this.errorIfDataNotFound({_id: adminId});
        return {data};
    };
}

const adminService = new AdminService();
export default adminService;
