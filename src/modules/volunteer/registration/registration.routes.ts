import {Application, Request, Response} from "express";

const {Router} = require("express");
const router = Router();
const routeUrl = "/registration";

router.get(routeUrl + "/ok", (req: Request, res: Response) =>
    res.send("barev")
);

router.setupRoutes = (app: Application, prefix: string): void => {
    app.use(prefix, router);
};

export default router;
