import {Application} from "express";
import {
    acceptVolunteerAdditionalData,
    getAllAvailableTags,
} from "./registration.controller";
import errorHandler from "../../../utils/errorHandler";

const {Router} = require("express");
const router = Router();
const routeUrl = "/registration";

router.route(routeUrl + "/tags").get(getAllAvailableTags);
router.route(routeUrl).post(acceptVolunteerAdditionalData);
router.use(errorHandler);

router.setupRoutes = (app: Application, prefix: string): void => {
    app.use(prefix, router);
};

export default router;
