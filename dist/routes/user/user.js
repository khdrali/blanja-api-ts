"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../../controllers/user/user");
const validation_1 = require("../../middlewares/validation");
const validate_token_1 = require("../../middlewares/validate-token");
const multerConfig_1 = __importDefault(require("../../middlewares/multerConfig"));
const router = express_1.default.Router();
router.get("/", validate_token_1.validateToken, user_1.GetAllUserController);
router.get("/user/:id", validate_token_1.validateToken, user_1.GetUserByIdController);
router.post("/add", validation_1.validateCreate, validation_1.handleValidationErrors, user_1.CreateUserControllers);
router.patch("/update/:id", multerConfig_1.default.fields([{ name: "photo", maxCount: 1 }]), validate_token_1.validateToken, user_1.UpdateUserProfileController);
router.patch("/change-password/:id", validate_token_1.validateToken, user_1.ChangePasswordControllers);
exports.default = router;
