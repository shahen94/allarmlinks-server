import {Application} from "express";
import {
    acceptVolunteerAdditionalData,
    getAllAvailableTags,
} from "./registration.controller";
import errorHandler from "../../../utils/errorHandler";

const {Router} = require("express");
const router = Router();

router.route("/tags").get(getAllAvailableTags);
router.route("/:token").post(acceptVolunteerAdditionalData);

router.setupRoutes = (app: Application, prefix: string): void => {
    router.use(errorHandler);
    app.use(prefix, router);
};

export default router;
