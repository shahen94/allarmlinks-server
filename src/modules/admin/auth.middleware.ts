import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import adminService from "./admin.service";
import { IAdmin } from "./admin.model";

interface authRequest extends Request {
  adminData: IAdmin;
}

const authorize = (req: authRequest, res: Response, next: NextFunction) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({
      message: "No token provided!",
    });
  }

  jwt.verify(
    `${token}`,
    `${process.env.JWT_SECRET_KEY}`,
    async (err, decoded: any) => {
      const adminData = await adminService.getAdminData(decoded.id);
      if (err || !adminData) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.adminData = adminData;
      next();
    }
  );
};

const authenticate = (req: authRequest, res: Response, next: NextFunction) => {
  if (req.adminData.type === "super") {
    next();
    return;
  }
  res.status(403).send({
    message: "Not super admin",
  });
  return;
};

export const authJwt = {
  authenticate,
  authorize,
};
