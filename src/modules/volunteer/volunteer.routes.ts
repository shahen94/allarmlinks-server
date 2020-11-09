import {Application} from "express";
import verificationRouter from "./verification/verification.routes";
import registrationRouter from "./registration/registration.routes";
import tagsRouter from "./tags/tags.routes";

const {Router} = require("express");
const router = Router();

// router.route("/").get(getVolunteerList);

router.setupRoutes = (app: Application, prefix: string): void => {
    const routeUrl = prefix + "/volunteer";

    verificationRouter.setupRoutes(router, "/verification");
    registrationRouter.setupRoutes(router, "/registration");
    tagsRouter.setupRoutes(router, "/tags");

    app.use(routeUrl, router);
};

export default router;
