"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerTag = exports.Tag = void 0;
var mongoose = __importStar(require("mongoose"));
var TagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});
var VolunteerTagSchema = new mongoose.Schema({
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
    tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true },
});
exports.Tag = mongoose.model("Tag", TagSchema);
exports.VolunteerTag = mongoose.model("VolunteerTag", VolunteerTagSchema);
