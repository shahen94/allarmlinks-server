import {Application} from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import errorHandler from "./utils/errorHandler";
import glob from "glob";
import connectDb from "./lib/dbConnection";
import cors from "cors";

const express = require("express");
require("express-async-errors");

class App {
    private readonly app: Application;

    constructor() {
        this.app = express();
        this.configure();
    }

    start(): void {
        this.app.listen(process.env.PORT, () =>
            console.log(`Server is running on port ${process.env.PORT}`)
        );
    }

    private async configure(): Promise<void> {
        dotenv.config({path: path.join(__dirname, "/config/config.env")});
        await connectDb();
        this.addMiddlewares();
        this.addRoutes();

        this.app.use(errorHandler);
    }

    private addMiddlewares(): void {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
    }

    private addRoutes(): void {
        glob("modules/**/*.routes.ts", {cwd: __dirname}, (err, routes) => {
            if (err) {
                throw err;
            }

            routes
                .map((filename) => require(`./${filename}`).default)
                .forEach((router) => {
                    router.setupRoutes(this.app, process.env.BASE_URL ? "" : `${process.env.BASE_URL}`);
                    router.use(errorHandler);
                });
        });
    }
}

export default new App();
