"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.createDummyData = exports.createDummyVolunteer = exports.getVolunteer = exports.getVolunteersCount = exports.getVolunteers = exports.updateWithAdditionalData = exports.validateAdditionalData = exports.existsVolunteerById = exports.updatePhoneVerificationStatus = exports.updateMailVerificationStatus = exports.validateVolunteerRegisterDataStepTwo = exports.createVolunteerForRegisterStepOne = exports.volunteerPhoneValidation = exports.volunteerStepOneDataValidation = exports.validateVolunteerRegisterDataStepOne = void 0;
var volunteer_model_1 = require("./volunteer.model");
var AppError_1 = __importDefault(require("../../errors/AppError"));
var NotFoundError_1 = __importDefault(require("../../errors/NotFoundError"));
var admin_interfaces_1 = require("../admin/admin.interfaces");
var tags_service_1 = require("./tags/tags.service");
var faker = require("faker");
var Joi = require("joi").extend(require("joi-phone-number"));
exports.validateVolunteerRegisterDataStepOne = function (data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.volunteerStepOneDataValidation.validateAsync(data)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, volunteer_model_1.Volunteer.findOne({ email: data.email })];
            }
        });
    });
};
exports.volunteerStepOneDataValidation = Joi.object({
    name: Joi.string().alphanum().min(1).required(),
    surname: Joi.string().alphanum().min(1).required(),
    email: Joi.string().email().required(),
});
exports.volunteerPhoneValidation = Joi.object({
    phone: Joi.string().phoneNumber(),
});
exports.createVolunteerForRegisterStepOne = function (data) {
    return __awaiter(this, void 0, void 0, function () {
        var volunteer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.validateVolunteerRegisterDataStepOne(data)];
                case 1:
                    volunteer = _a.sent();
                    if (!!volunteer) return [3 /*break*/, 3];
                    return [4 /*yield*/, volunteer_model_1.Volunteer.create({
                            name: data.name,
                            surname: data.surname,
                            email: data.email,
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3: return [2 /*return*/, volunteer];
            }
        });
    });
};
exports.validateVolunteerRegisterDataStepTwo = function (data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.volunteerPhoneValidation.validateAsync(data)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.updateMailVerificationStatus = function (id) {
    return volunteer_model_1.Volunteer.findByIdAndUpdate(id, { status: volunteer_model_1.STATUS_EMAIL_VERIFIED }, {
        new: true,
        runValidators: true,
    });
};
exports.updatePhoneVerificationStatus = function (id, phone) {
    return volunteer_model_1.Volunteer.findByIdAndUpdate(id, {
        status: volunteer_model_1.STATUS_PHONE_VERIFIED,
        phone: phone,
    }, {
        new: true,
        runValidators: true,
    });
};
exports.existsVolunteerById = function (volunteerId) { return __awaiter(void 0, void 0, void 0, function () {
    var volunteer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, volunteer_model_1.Volunteer.findById(volunteerId)];
            case 1:
                volunteer = _a.sent();
                return [2 /*return*/, !!volunteer];
        }
    });
}); };
exports.validateAdditionalData = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var volunteer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, volunteer_model_1.Volunteer.findById(data._id)];
            case 1:
                volunteer = _a.sent();
                if (!volunteer)
                    throw new AppError_1.default(400, "Volunteer doesn't exist");
                if (volunteer.status != volunteer_model_1.STATUS_PHONE_VERIFIED)
                    throw new AppError_1.default(400, "Invalid status.");
                if (!data.country || !data.city || !data.birthDate)
                    throw new AppError_1.default(400, "Birth date, country and city fields are required");
                return [2 /*return*/];
        }
    });
}); };
exports.updateWithAdditionalData = function (data, session) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.validateAdditionalData(data)];
            case 1:
                _a.sent();
                return [2 /*return*/, volunteer_model_1.Volunteer.findByIdAndUpdate(data._id, {
                        birthDate: data.birthDate,
                        country: data.country,
                        city: data.city,
                        address: data.address,
                        specialization: data.specialization,
                        currentEmployerName: data.currentEmployerName,
                        occupation: data.occupation,
                        languages: data.languages,
                        hoursPerWeek: data.hoursPerWeek,
                        facebookProfile: data.facebookProfile,
                        linkedinProfile: data.linkedinProfile,
                        twitterProfile: data.twitterProfile,
                        whereToVolunteer: data.whereToVolunteer,
                        other: data.other,
                        status: volunteer_model_1.STATUS_FINISHED,
                    }, {
                        new: true,
                        runValidators: true,
                        session: session,
                    })];
        }
    });
}); };
exports.getVolunteers = function (volunteerId, limit, filter) {
    if (volunteerId === void 0) { volunteerId = ''; }
    return __awaiter(void 0, void 0, void 0, function () {
        var value, query, condition;
        return __generator(this, function (_a) {
            value = filter.value;
            if (filter.type && value) {
                switch (filter.type) {
                    case admin_interfaces_1.FilterType.FullName:
                        query = volunteer_model_1.Volunteer.find().byFullName(value, volunteerId);
                        break;
                    case admin_interfaces_1.FilterType.CompanyOccupation:
                        query = volunteer_model_1.Volunteer.find().byCompanyOccupation(value, volunteerId);
                        break;
                    case admin_interfaces_1.FilterType.CountryCity:
                        query = volunteer_model_1.Volunteer.find().byCountryCity(value, volunteerId);
                        break;
                    case admin_interfaces_1.FilterType.Email:
                        query = volunteer_model_1.Volunteer.find().byEmail(value, volunteerId);
                        break;
                    case admin_interfaces_1.FilterType.Language:
                        query = volunteer_model_1.Volunteer.find().byLanguage(value, volunteerId);
                        break;
                    case admin_interfaces_1.FilterType.Skills:
                        return [2 /*return*/, tags_service_1.getVolunteersForTags(value.split(' '), volunteerId)];
                    default: {
                        condition = { status: volunteer_model_1.STATUS_FINISHED };
                        if (volunteerId) {
                            condition._id = { $gt: volunteerId };
                        }
                        query = volunteer_model_1.Volunteer.find(condition);
                    }
                }
                return [2 /*return*/, query.sort({ _id: 1 }).limit(limit)];
            }
            else {
                if (volunteerId)
                    return [2 /*return*/, volunteer_model_1.Volunteer.find({ _id: { $gt: volunteerId }, status: volunteer_model_1.STATUS_FINISHED })
                            .sort({ _id: 1 })
                            .limit(limit)];
                else
                    return [2 /*return*/, volunteer_model_1.Volunteer.find({ status: volunteer_model_1.STATUS_FINISHED }).sort({ _id: 1 }).limit(limit)];
            }
            return [2 /*return*/];
        });
    });
};
exports.getVolunteersCount = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, volunteer_model_1.Volunteer.countDocuments({})];
    });
}); };
exports.getVolunteer = function (volunteerId) { return __awaiter(void 0, void 0, void 0, function () {
    var data, skillData, skills;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, volunteer_model_1.Volunteer.findById(volunteerId)];
            case 1:
                data = _a.sent();
                if (!data) {
                    throw new NotFoundError_1.default("Volunteer not found");
                }
                return [4 /*yield*/, tags_service_1.getTagsForVolunteer(volunteerId)];
            case 2:
                skillData = _a.sent();
                skills = skillData.map(function (obj) { return obj.name; });
                return [2 /*return*/, __assign(__assign({}, data.toObject()), { skills: skills })];
        }
    });
}); };
exports.createDummyVolunteer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, surname, email, phone, volunteer;
    return __generator(this, function (_b) {
        _a = faker.name.findName().split(" "), name = _a[0], surname = _a[1];
        email = faker.internet.email();
        phone = faker.phone.phoneNumber();
        volunteer = {
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            city: "Yerevan",
            country: "Armenia",
            status: volunteer_model_1.STATUS_FINISHED,
        };
        return [2 /*return*/, volunteer_model_1.Volunteer.create(volunteer)];
    });
}); };
exports.createDummyData = function (limit) { return __awaiter(void 0, void 0, void 0, function () {
    var i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < limit)) return [3 /*break*/, 4];
                return [4 /*yield*/, exports.createDummyVolunteer()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
// interface  IConditions {
//     [key: stirng] : string
// }
//
// data = Volunteer.find({}));
//
// export const searchByField = async (data:query: IFilterQuery) => {
//     return Volunteer.find({
//         [query.field]: query.exp
//     });
// }
//
// export const filterByFields = async (queries: IFilterQuery[]) => {
//     if (queries.length > 1) {
//         let result = await searchByField(queries[0]);
//         for (let i = 1; i < queries.length; i++)
//             result = await searchByField(result, queries[i]);
//         return result;
//     }
//     return [];
// }
