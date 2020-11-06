import {Application} from "express";
import errorHandler from "../../../utils/errorHandler";
import {getAllAvailableTagsForVolunteer} from "./tags.controller";

const {Router} = require("express");
const router = Router();

router.route("/").get(getAllAvailableTagsForVolunteer);

router.setupRoutes = (app: Application, prefix: string): void => {
    app.use(prefix, router);
};

export default router;
