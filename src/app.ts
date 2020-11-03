import express, {Application} from "express";
import bodyParser from "body-parser";
import connectDb from "./lib/dbConnection";
import dotenv from "dotenv";
import path from "path";
import "express-async-errors";
import errorHandler from "./utils/errorHandler";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.configure();
    }

    start() {
        this.app.listen(process.env.PORT, () =>
            console.log(`Server is running on port ${process.env.PORT}`)
        );
    }

    private configure(): void {
        dotenv.config({path: path.join(__dirname, "/config/config.env")});
        connectDb();
        this.addMiddlewares();
    }

    private addMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));

        this.app.use(errorHandler)
    }
}

export default new App();
