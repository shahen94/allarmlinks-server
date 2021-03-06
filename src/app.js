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
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var errorHandler_1 = __importDefault(require("./utils/errorHandler"));
var glob_1 = __importDefault(require("glob"));
var dbConnection_1 = __importDefault(require("./lib/dbConnection"));
var admin_service_1 = __importDefault(require("./modules/admin/admin.service"));
var cors_1 = __importDefault(require("cors"));
var admin_model_1 = require("./modules/admin/admin.model");
var express = require("express");
require("express-async-errors");
var App = /** @class */ (function () {
    function App() {
        this.app = express();
        this.configure();
    }
    App.prototype.start = function () {
        this.app.listen(process.env.PORT, function () {
            return console.log("Server is running on port " + process.env.PORT);
        });
    };
    App.prototype.configure = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dotenv_1.default.config({ path: path_1.default.join(__dirname, "/config/config.env") });
                        return [4 /*yield*/, dbConnection_1.default()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.initAdminData()];
                    case 2:
                        _a.sent();
                        this.addMiddlewares();
                        this.addRoutes();
                        this.app.use(errorHandler_1.default);
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.addMiddlewares = function () {
        this.app.use(cors_1.default());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
    };
    App.prototype.addRoutes = function () {
        var _this = this;
        glob_1.default("modules/**/*.routes.ts", { cwd: __dirname }, function (err, routes) {
            if (err) {
                throw err;
            }
            routes
                .map(function (filename) { return require("./" + filename).default; })
                .forEach(function (router) {
                router.setupRoutes(_this.app, process.env.BASE_URL ? "" : "" + process.env.BASE_URL);
                router.use(errorHandler_1.default);
            });
        });
    };
    App.prototype.initAdminData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, admin_model_1.Admin.find({ type: "super" })];
                    case 1:
                        exists = _a.sent();
                        if (!!exists) return [3 /*break*/, 3];
                        return [4 /*yield*/, admin_service_1.default.createAdminData("adminName", "adminSurname", "admin@gmail.com", "admin", "super")];
                    case 2:
                        _a.sent();
                        console.log("Super admin data init");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return App;
}());
exports.default = new App();
