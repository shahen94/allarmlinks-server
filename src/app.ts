import express from "express";
import bodyParser from "body-parser";
import connectDb from "./lib/dbConnection";
import dotenv from "dotenv"
import path from "path"
import 'express-async-errors';

class App {
   public app: express.Application;
   constructor() {
      this.app = express();
      this.configure();
    }
    private configure(): void {
        dotenv.config({ path: path.join(__dirname, "/config/config.env") });
        connectDb();
        this.addMiddlewares()
    }
    private addMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    start() {
        this.app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))
    }
}
export default new App();