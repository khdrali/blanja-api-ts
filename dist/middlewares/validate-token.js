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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            res.status(401).json({
                valid: false,
                status: 401,
                message: "No token provided",
            });
        }
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.replace("Bearer ", "");
        // Gunakan Promisify untuk jwt.verify jika diperlukan async
        jsonwebtoken_1.default.verify(token !== null && token !== void 0 ? token : "", process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    valid: false,
                    status: 401,
                    message: "Invalid Token",
                });
            }
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        res.status(500).json({
            valid: false,
            status: 500,
            message: "Server error",
            data: [],
        });
    }
});
exports.validateToken = validateToken;