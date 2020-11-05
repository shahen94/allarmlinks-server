import {Application} from "express";
import verificationRouter from "./verification/verification.routes";
import registrationRouter from "./registration/registration.routes";

const {Router} = require("express");
const router = Router();
const routeUrl = "volunteer";

router.setupRoutes = (app: Application, prefix: string): void => {
    verificationRouter.setupRoutes(router, prefix + routeUrl);
    registrationRouter.setupRoutes(router, prefix + routeUrl);
    app.use(prefix, router);
};

export default router;
