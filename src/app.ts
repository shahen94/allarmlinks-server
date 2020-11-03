import express, {Application} from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import "express-async-errors";
import errorHandler from "./utils/errorHandler";
import glob from "glob"
import connectDb from "./lib/dbConnection";


class App {
    private readonly app: Application;

    constructor() {
        this.app = express();
        this.configure();
    }

    start() {
        this.app.listen(process.env.PORT, () =>
            console.log(`Server is running on port ${process.env.PORT}`)
        );
    }

    private async configure(): Promise<void> {
        dotenv.config({path: path.join(__dirname, "/config/config.env")});
        await connectDb();
        this.addMiddlewares();
        this.addRoutes()

    }

    private addMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));

        this.app.use(errorHandler);
    }

    private addRoutes(): void{
        glob('modules/**/*.routes.ts', { cwd: __dirname }, (err, routes) => {
                if (err) {
                    throw err;
                }

                routes.map(filename => require(`./${filename}`).default)
                    .forEach((router)=>router.setupRoutes(this.app, process.env.BASE_URL));
            });
    }

}

export default new App();
