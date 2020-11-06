import {Application} from "express";
import {registerStepOne, registerStepTwo, verifyEmailToken, verifyPhoneCode,} from "./verification.controller";
import errorHandler from "../../../utils/errorHandler";

const {Router} = require("express");
const router = Router();

router.route("/email").post(registerStepOne);
router.route("/email/:token").get(verifyEmailToken);
router.route("/phone/:token").post(registerStepTwo);
router.route("/phone/code/:token").post(verifyPhoneCode);

router.setupRoutes = (app: Application, prefix: string): void => {
    router.use(errorHandler);
    app.use(prefix, router);
};

export default router;
