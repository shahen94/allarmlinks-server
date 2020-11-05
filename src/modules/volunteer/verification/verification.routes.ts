import {Application} from "express";
import {registerStepOne, registerStepTwo, verifyEmailToken, verifyPhoneCode,} from "./verification.controller";
import errorHandler from "../../../utils/errorHandler";

const {Router} = require("express");
const router = Router();
const routeUrl = "/verification";

router.route(routeUrl + "/email").post(registerStepOne);
router.route(routeUrl + "/email/:token").get(verifyEmailToken);
router.route(routeUrl + "/phone").post(registerStepTwo);
router.route(routeUrl + "/phone/code").post(verifyPhoneCode);
router.use(errorHandler);

router.setupRoutes = (app: Application, prefix: string): void => {
    app.use(prefix, router);
};

export default router;
