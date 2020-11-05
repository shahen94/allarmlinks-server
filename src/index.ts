import app from "./app";
import {Volunteer} from "./modules/volunteer/volunteer.model";

app.start();

if (`${process.env.DELETE_VOLUNTEERS}` == "true")
    Volunteer.deleteMany({}, () => console.log("ALl FILES DELETED."));
