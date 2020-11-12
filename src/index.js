"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var volunteer_model_1 = require("./modules/volunteer/volunteer.model");
var volunteer_service_1 = require("./modules/volunteer/volunteer.service");
app_1.default.start();
if ("" + process.env.DELETE_VOLUNTEERS == "true")
    volunteer_model_1.Volunteer.deleteMany({}, function () { return console.log("ALl FILES DELETED."); });
if ("" + process.env.CREATE_DUMMY_VOLUNTEERS == "true")
    volunteer_service_1.createDummyData(100).then(function () { return console.log("New 100 volunteers created :)"); });
