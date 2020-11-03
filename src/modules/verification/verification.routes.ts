import {Application, Request, Response} from "express";

const { Router } = require("express");
const router = Router();
const routeUrl = "/email";

router.route(routeUrl).get((req:Request, res:Response)=>res.send("111"))

router.setupRoutes = (app: Application, prefix: string) :void => {
    app.use(prefix, router);
};

export default router;
