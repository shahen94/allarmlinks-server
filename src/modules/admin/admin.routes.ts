import {authJwt} from "./auth.middleware";
import {Application} from "express";
import {
    addGeneralAdmin,
    deleteGeneralAdmin,
    editGeneralAdmin,
    getGeneralAdminData,
    getGeneralAdmins,
    login,
    profile,
} from "./admin.controller";

const {Router} = require("express");

const router = Router();
const routeUrl = "/admin";

router.route("/login").post(login);
router.route("/profile").get(authJwt.authorize, profile);
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
