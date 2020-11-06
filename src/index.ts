import app from "./app";
import {Volunteer} from "./modules/volunteer/volunteer.model";
import {createDummyData} from "./modules/volunteer/volunteer.service";

app.start();

if (`${process.env.DELETE_VOLUNTEERS}` == "true")
    Volunteer.deleteMany({}, () => console.log("ALl FILES DELETED."));

if (`${process.env.CREATE_DUMMY_VOLUNTEERS}` == "true")
    createDummyData(100).then(() => console.log("New 100 volunteers created :)"));
