"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volunteer = exports.STATUS_FINISHED = exports.STATUS_PHONE_VERIFIED = exports.STATUS_EMAIL_VERIFIED = exports.STATUS_INITIALIZED = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var regexp_1 = require("../../utils/regexp");
exports.STATUS_INITIALIZED = "initialized";
exports.STATUS_EMAIL_VERIFIED = "email verified";
exports.STATUS_PHONE_VERIFIED = "phone verified";
exports.STATUS_FINISHED = "finished";
var VolunteerSchema = new mongoose_1.default.Schema({
    name: String,
    surname: String,
    email: { type: String, trim: true, index: true, unique: true, sparse: true },
    phone: { type: String, trim: true, index: true, unique: true, sparse: true, default: undefined },
    status: { type: String, default: exports.STATUS_INITIALIZED },
    birthDate: { type: String, default: null },
    country: { type: String, default: null },
    city: { type: String, default: null },
    address: { type: String, default: null },
    specialization: { type: String, default: null },
    currentEmployerName: { type: String, default: null },
    occupation: { type: String, default: null },
    languages: [String],
    hoursPerWeek: {
        from: { type: Number, default: null },
        to: { type: Number, default: null },
    },
    workStatus: { type: String, default: null },
    facebookProfile: { type: String, default: null },
    linkedinProfile: { type: String, default: null },
    twitterProfile: { type: String, default: null },
    whereToVolunteer: { type: String, default: null },
    other: { type: String, default: null },
    note: { type: String, default: null },
});
var volunteerQueryHelpers = {
    byFullName: function (fullName, volunteerId) {
        if (volunteerId === void 0) { volunteerId = ''; }
        var _a = fullName.split(' '), name1 = _a[0], name2 = _a[1];
        var query;
        if (name2)
            query = {
                $and: [
                    { name: regexp_1.caseInsExp(name1) },
                    { surname: regexp_1.caseInsExp(name2) },
                    { status: exports.STATUS_FINISHED }
                ]
            };
        else
            query = {
                $and: [
                    { $or: [{ name: regexp_1.caseInsExp(name1) }, { surname: regexp_1.caseInsExp(name1) }] },
                    { status: exports.STATUS_FINISHED },
                ]
            };
        if (volunteerId) {
            query.$and.push({
                _id: { $gt: volunteerId }
            });
        }
        return this.where(query);
    },
    byLanguage: function (languages, volunteerId) {
        if (volunteerId === void 0) { volunteerId = ''; }
        var langs = languages.split(' ').map(function (lang) { return regexp_1.caseInsExp(lang); });
        console.log(langs);
        var query = {
            $and: [
                {
                    languages: { $in: langs }
                }
            ]
        };
        if (volunteerId) {
            query.$and.push({
                _id: { $gt: volunteerId }
            });
        }
        query.$and.push({ status: exports.STATUS_FINISHED });
        return this.where(query);
    },
    byEmail: function (email, volunteerId) {
        if (volunteerId === void 0) { volunteerId = ''; }
        var query = {
            $and: [
                { email: new RegExp(".*" + email + ".*") },
                { status: exports.STATUS_FINISHED }
            ]
        };
        if (volunteerId) {
            query.$and.push({
                _id: { $gt: volunteerId }
            });
        }
        return this.where(query);
    },
    byCompanyOccupation: function (companyOccupation, volunteerId) {
        if (volunteerId === void 0) { volunteerId = ''; }
        var query;
        query = { $and: [{ $or: [{ currentEmployerName: regexp_1.caseInsExp(companyOccupation) }, { occupation: regexp_1.caseInsExp(companyOccupation) }] }] };
        if (volunteerId) {
            query.$and.push({
                _id: { $gt: volunteerId }
            }, { status: exports.STATUS_FINISHED });
        }
        return this.where(query);
    },
    byCountryCity: function (countryCity, volunteerId) {
        if (volunteerId === void 0) { volunteerId = ''; }
        var query;
        query = { $and: [{ $or: [{ country: regexp_1.caseInsExp(countryCity) }, { city: regexp_1.caseInsExp(countryCity) }] }] };
        if (volunteerId) {
            query.$and.push({
                _id: { $gt: volunteerId }
            });
        }
        query.$and.push({ status: exports.STATUS_FINISHED });
        return this.where(query);
    }
};
VolunteerSchema.query = volunteerQueryHelpers;
exports.Volunteer = mongoose_1.default.model("Volunteer", VolunteerSchema);
