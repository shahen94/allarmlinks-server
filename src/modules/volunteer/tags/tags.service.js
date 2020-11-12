"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsIds = exports.getAllTags = exports.getTagsForVolunteer = exports.getVolunteersForTags = exports.getVolunteersForTagsPipeline = exports.connectTagsToVolunteer = exports.connectNewTagsToVolunteer = exports.connectTagToVolunteer = exports.connectNewTagToVolunteer = exports.findTagByName = exports.getTagByName = exports.addTag = void 0;
var tags_model_1 = require("./tags.model");
var AppError_1 = __importDefault(require("../../../errors/AppError"));
var volunteer_service_1 = require("../volunteer.service");
var volunteer_model_1 = require("../volunteer.model");
var regexp_1 = require("../../../utils/regexp");
var mongoose = require("mongoose");
exports.addTag = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var tag;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.findTagByName(name)];
            case 1:
                tag = _a.sent();
                if (!!tag) return [3 /*break*/, 3];
                return [4 /*yield*/, tags_model_1.Tag.create({
                        name: name.toLowerCase()
                    })];
            case 2:
                tag = _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, tag];
        }
    });
}); };
exports.getTagByName = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var tag;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.findTagByName(name)];
            case 1:
                tag = _a.sent();
                if (!tag)
                    throw new AppError_1.default(500, "Can't get tag");
                return [2 /*return*/, tag];
        }
    });
}); };
exports.findTagByName = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, tags_model_1.Tag.findOne({ name: name })];
    });
}); };
exports.connectNewTagToVolunteer = function (volunteerId, name, session) { return __awaiter(void 0, void 0, void 0, function () {
    var tag;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.addTag(name)];
            case 1:
                tag = _a.sent();
                return [4 /*yield*/, exports.connectTagToVolunteer(volunteerId, tag._id, session)];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.connectTagToVolunteer = function (volunteerId, tagId, session) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tags_model_1.VolunteerTag.create([{
                        volunteerId: volunteerId,
                        tagId: tagId
                    }], {
                    session: session
                })
                    // ignore duplicate errors
                    .catch(function (err) {
                    if (err.name === 'MongoError' && err.code === 11000)
                        return;
                    throw err;
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.connectNewTagsToVolunteer = function (volunteerId, tagNames, session) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, tagNames_1, name_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, volunteer_service_1.existsVolunteerById(volunteerId)];
            case 1:
                if (!(_a.sent()))
                    throw new AppError_1.default(400, "Volunteer doesn't exist.");
                _i = 0, tagNames_1 = tagNames;
                _a.label = 2;
            case 2:
                if (!(_i < tagNames_1.length)) return [3 /*break*/, 5];
                name_1 = tagNames_1[_i];
                return [4 /*yield*/, exports.connectNewTagToVolunteer(volunteerId, name_1, session)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.connectTagsToVolunteer = function (volunteerId, tagIds, session) { return __awaiter(void 0, void 0, void 0, function () {
    var entries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, volunteer_service_1.existsVolunteerById(volunteerId)];
            case 1:
                if (!(_a.sent()))
                    throw new AppError_1.default(400, "Volunteer doesn't exist.");
                entries = [];
                tagIds.forEach(function (id) { return entries.push({
                    volunteerId: volunteerId,
                    tagId: id
                }); });
                return [2 /*return*/, tags_model_1.VolunteerTag.create(entries, { session: session })];
        }
    });
}); };
var getTagsPipeline = function (volunteerId) {
    return [
        {
            "$project": {
                "_id": 0,
                "volunteertags": "$$ROOT"
            }
        },
        {
            "$lookup": {
                "localField": "volunteertags.tagId",
                "from": "tags",
                "foreignField": "_id",
                "as": "tags"
            }
        },
        {
            "$unwind": {
                "path": "$tags",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$match": {
                "volunteertags.volunteerId": new mongoose.mongo.ObjectId(volunteerId)
            }
        },
        {
            "$project": {
                "_id": "$tags._id",
                "name": "$tags.name",
            }
        }
    ];
};
exports.getVolunteersForTagsPipeline = function (tags, pointer) {
    var expr = {};
    var regExps = tags.map(function (tag) { return regexp_1.caseInsExp(tag); });
    if (pointer) {
        expr["volunteers._id"] = {
            "$gt": pointer
        };
    }
    return [
        {
            "$project": {
                "_id": 0,
                "tags": "$$ROOT"
            }
        },
        {
            "$lookup": {
                "localField": "tags._id",
                "from": "volunteertags",
                "foreignField": "tagId",
                "as": "volunteertags"
            }
        },
        {
            "$unwind": {
                "path": "$volunteertags",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$lookup": {
                "localField": "volunteertags.volunteerId",
                "from": "volunteers",
                "foreignField": "_id",
                "as": "volunteers"
            }
        },
        {
            "$unwind": {
                "path": "$volunteers",
                "preserveNullAndEmptyArrays": false
            }
        },
        {
            "$match": {
                "$and": [
                    {
                        "tags.name": {
                            "$in": regExps
                        }
                    },
                    {
                        "volunteers.status": volunteer_model_1.STATUS_FINISHED
                    },
                    expr
                ]
            }
        },
        {
            "$project": {
                "name": "$volunteers.name",
                "surname": "$volunteers.surname",
                "email": "$volunteers.email",
                "phone": "$volunteers.phone",
                "birthDate": "$volunteers.birthDate",
                "country": "$volunteers.country",
                "city": "$volunteers.city",
                "address": "$volunteers.address",
                "specialization": "$volunteers.specialization",
                "currentEmployerName": "$volunteers.currentEmployerName",
                "occupation": "$volunteers.occupation",
                "languages": "$volunteers.languages",
                "hoursPerWeek": "$volunteers.hoursPerWeek",
                "workStatus": "$volunteers.workStatus",
                "facebookProfile": "$volunteers.facebookProfile",
                "linkedinProfile": "$volunteers.linkedinProfile",
                "twitterProfile": "$volunteers.twitterProfile",
                "whereToVolunteer": "$volunteers.whereToVolunteer",
                "other": "$volunteers.other",
                "note": "$volunteers.note",
                "_id": "$volunteers._id",
            }
        }
    ];
};
exports.getVolunteersForTags = function (tags, pointer) {
    return tags_model_1.Tag.aggregate(exports.getVolunteersForTagsPipeline(tags, pointer));
};
exports.getTagsForVolunteer = function (volunteerId) {
    return tags_model_1.VolunteerTag.aggregate(getTagsPipeline(volunteerId));
};
exports.getAllTags = function () {
    return tags_model_1.Tag.find({});
};
exports.containsIds = function (tagIds) { return __awaiter(void 0, void 0, void 0, function () {
    var tags;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tags_model_1.Tag.find({ _id: { $in: tagIds } })];
            case 1:
                tags = _a.sent();
                return [2 /*return*/, (tagIds.length === 0 && !tags) || tags.length === tagIds.length];
        }
    });
}); };
