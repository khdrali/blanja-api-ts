"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const validation_1 = require("../middlewares/validation");
const router = express_1.default.Router();
router.get("/", user_1.GetAllUserController);
router.post("/add", validation_1.validateCreate, validation_1.handleValidationErrors, user_1.CreateUserControllers);
exports.default = router;
