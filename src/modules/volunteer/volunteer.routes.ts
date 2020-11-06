import {Application} from "express";
import verificationRouter from "./verification/verification.routes";
import registrationRouter from "./registration/registration.routes";
import tagsRouter from "./tags/tags.routes";
import {getVolunteerList} from "./volunteer.controller";

const {Router} = require("express");
const router = Router();
const routeUrl = "volunteer";
const tags = "tags";

router.route("/" + routeUrl).get(getVolunteerList);
router.route("/" + routeUrl)

router.setupRoutes = (app: Application, prefix: string): void => {
    verificationRouter.setupRoutes(router, prefix + routeUrl);
    registrationRouter.setupRoutes(router, prefix + routeUrl);
    tagsRouter.setupRoutes(router, prefix + routeUrl);
    app.use(prefix, router);
};

export default router;
