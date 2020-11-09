import {Application} from "express";

const {Router} = require("express");

export const createRouter = () => {
    const router = Router();
    const subrouters: Application[] = [];

    router.setupRoutes = (app: Application, routeUrl: string): void => {
        app.use(routeUrl, router);
    };

    return router;
}