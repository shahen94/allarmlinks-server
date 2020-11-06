import { authJwt } from "./auth.middleware";
import { Application } from "express";
import {
  login,
  profile,
  addGeneralAdmin,
  gettingAdmins,
  editingAdmin,
  deletingAdmin,
  gettingDataAdmin,
} from "./admin.controller";

const { Router } = require("express");
const router = Router();

const routeUrl = "/admin";

router.route("/login").post(login);
router.route("/profile").get(authJwt.authorize, profile);
router
  .route("/addAdmin")
  .post([authJwt.authorize, authJwt.authenticate], addGeneralAdmin);
router
  .route("/admins")
  .get([authJwt.authorize, authJwt.authenticate], gettingAdmins);
router
  .route("/admins/:id")
  .all([authJwt.authorize, authJwt.authenticate])
  .get(gettingDataAdmin)
  .put(editingAdmin)
  .delete(deletingAdmin);

router.setupRoutes = (app: Application, prefix: string): void => {
  app.use(prefix + routeUrl, router);
};

export default router;
