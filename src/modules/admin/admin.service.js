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
var admin_model_1 = require("./admin.model");
var admin_interfaces_1 = require("./admin.interfaces");
var tokenUtils_1 = require("../../utils/tokenUtils");
var NotFoundError_1 = __importDefault(require("../../errors/NotFoundError"));
var BadRequestError_1 = __importDefault(require("../../errors/BadRequestError"));
var regexp_1 = require("../../utils/regexp");
var AdminService = /** @class */ (function () {
    function AdminService() {
        var _this = this;
        this.createAdminData = function (name, surname, email, password, type) {
            if (type === void 0) { type = "general"; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, admin_model_1.Admin.create({ name: name, surname: surname, email: email, password: password, type: type })];
                        case 1: 
                        // const hashedPass = bcrypt.hashSync(password, 10);
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        this.getDataWithJwt = function (loggedEmail, loggedPassword) { return __awaiter(_this, void 0, void 0, function () {
            var adminData, accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.errorIfDataNotFound({ email: loggedEmail }, false)];
                    case 1:
                        adminData = _a.sent();
                        adminData.isCorrectPassword(loggedPassword);
                        accessToken = tokenUtils_1.createToken(adminData._id);
                        return [2 /*return*/, { adminData: adminData, accessToken: accessToken }];
                }
            });
        }); };
        this.errorIfDataExists = function (condition) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, admin_model_1.Admin.findOne(condition)];
                    case 1:
                        data = _a.sent();
                        if (data)
                            throw new BadRequestError_1.default(Object.keys(condition)[0] + " already exists");
                        return [2 /*return*/];
                }
            });
        }); };
        this.errorIfDataNotFound = function (condition, get) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, admin_model_1.Admin.findOne(condition)];
                    case 1:
                        data = _a.sent();
                        if (!data) {
                            if (get)
                                throw new NotFoundError_1.default(Object.keys(condition)[0] + " not found");
                            else
                                throw new BadRequestError_1.default(Object.keys(condition)[0] + " not found");
                        }
                        return [2 /*return*/, data];
                }
            });
        }); };
        this.getGeneralAdmins = function (filter) { return __awaiter(_this, void 0, void 0, function () {
            var value, condition;
            return __generator(this, function (_a) {
                value = regexp_1.caseInsExp(filter.value);
                condition = {
                    type: 'general',
                };
                switch (filter.type) {
                    case admin_interfaces_1.AdminFilterType.Name:
                        condition[admin_interfaces_1.AdminFilterType.Name] = value;
                        break;
                    case admin_interfaces_1.AdminFilterType.Surname:
                        condition[admin_interfaces_1.AdminFilterType.Surname] = value;
                        break;
                    case admin_interfaces_1.AdminFilterType.Email:
                        condition[admin_interfaces_1.AdminFilterType.Email] = value;
                        break;
                }
                return [2 /*return*/, admin_model_1.Admin.find(condition)];
            });
        }); };
        this.editGeneralAdmin = function (adminId, editedData) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, admin_model_1.Admin.findByIdAndUpdate(adminId, editedData, {
                            new: true,
                            runValidators: true,
                        })];
                    case 1:
                        data = _a.sent();
                        if (!data)
                            throw new NotFoundError_1.default("Admin not found");
                        return [2 /*return*/, data];
                }
            });
        }); };
        this.deleteGeneralAdmin = function (adminId) { return __awaiter(_this, void 0, void 0, function () {
            var adminToBeDeleted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, admin_model_1.Admin.findByIdAndDelete(adminId)];
                    case 1:
                        adminToBeDeleted = _a.sent();
                        if (!adminToBeDeleted)
                            throw new NotFoundError_1.default("Admin not found");
                        return [2 /*return*/];
                }
            });
        }); };
        this.getGeneralAdminData = function (adminId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.errorIfDataNotFound({ _id: adminId }, true)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    }
    return AdminService;
}());
var adminService = new AdminService();
exports.default = adminService;
