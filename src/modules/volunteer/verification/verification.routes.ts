import {Application} from "express";
import {registerStepOne, registerStepTwo, verifyEmailToken, verifyPhoneCode,} from "./verification.controller";
import errorHandler from "../../../utils/errorHandler";

const {Router} = require("express");
const router = Router();

router.route("/email").post(registerStepOne);
router.route("/email/:token").get(verifyEmailToken);
router.route("/phone").post(registerStepTwo);
router.route("/phone/code").post(verifyPhoneCode);

router.setupRoutes = (app: Application, prefix: string): void => {
    app.use(prefix, router);
};

export default router;
