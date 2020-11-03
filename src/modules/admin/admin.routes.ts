import {Application, Request, Response} from "express";

const { Router } = require("express");
const router = Router();
const route_url = "/admin";

router.route(route_url).get((req:Request, res:Response)=>res.send("2156"))

router.setupRoutes = (app: Application, prefix: string) :void => {
    app.use(prefix, router);
};

export default router;
