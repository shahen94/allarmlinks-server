import { authJwt } from "./auth.middleware";
import { Application } from "express";
import {
    addGeneralAdmin,
    updateWorkStatus,
    deleteGeneralAdmin,
    editGeneralAdmin,
    getGeneralAdminData,
    getGeneralAdmins,
    getVolunteerData,
    getVolunteersList,
    login,
} from "./admin.controller";


const { Router } = require("express");

const router = Router();
const routeUrl = "/admin";

router.route("/login").post(login);
router.route("/volunteers").get(authJwt.authorize, getVolunteersList);
router.route("/volunteers/:id").get(authJwt.authorize, getVolunteerData);
router.route("/volunteers/workstatus/:id").put(authJwt.authorize, updateWorkStatus);


router
    .route("/addAdmin")
    .post([authJwt.authorize, authJwt.authenticate], addGeneralAdmin);
router
    .route("/admins")
    .get([authJwt.authorize, authJwt.authenticate], getGeneralAdmins);
router
    .route("/admins/:id")
    .all([authJwt.authorize, authJwt.authenticate])
    .get(getGeneralAdminData)
    .put(editGeneralAdmin)
    .delete(deleteGeneralAdmin);

router.setupRoutes = (app: Application, prefix: string): void => {
    app.use(prefix + routeUrl, router);
};

export default router;
