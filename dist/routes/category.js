"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = require("../controllers/category");
const categoryRoutes = express_1.default.Router();
categoryRoutes.post("/add-category", category_1.addCategoryController);
categoryRoutes.get("/", category_1.getCategoryController);
categoryRoutes.patch("/update-category/:id", category_1.UpdateCategoryController);
exports.default = categoryRoutes;
