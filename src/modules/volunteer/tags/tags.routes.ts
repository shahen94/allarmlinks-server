import {Application} from "express";
import errorHandler from "../../../utils/errorHandler";
import {getAllAvailableTagsForVolunteer} from "./tags.controller";

const {Router} = require("express");
const router = Router();
const routeUrl = "/tags";

router.use(errorHandler);
router.route(routeUrl).get(getAllAvailableTagsForVolunteer);

router.setupRoutes = (app: Application, prefix: string): void => {
    app.use(prefix, router);
};

export default router;
